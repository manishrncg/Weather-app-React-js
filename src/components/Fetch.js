import React, { Component } from 'react';
import Tab from './Tab';

class Fetch extends Component {
  constructor(props){
    super(props);
    this.weatherData = {};

    this.state = {
      day: false,
      clicked: 1
    };
    this.fullDay              = this.fullDay.bind(this);
    this.showDayWiseWeather   = this.showDayWiseWeather.bind(this);
    this.showWholeWeekWeather = this.showWholeWeekWeather.bind(this);
  }

  componentWillMount(){  // fetch data from api for whole week
    const lat = this.props.lat;  // latitude
    const lon = this.props.lon;  // longitue
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&units=metric&appid=3279b275644f5e71cba5375e72028012")
      .then(response => {
        if (response.ok) {
          return Promise.resolve(response);
        }
        else {
          return Promise.reject(new Error('Failed to load')); 
        }
      })
      .then(response => response.json()) // parse response as JSON
      .then(data => {
        this.weatherData = data;
        this.setState({
          day: false
        });
      })
      .catch(function(error) {
        console.log(`Error: ${error.message}`);
      })
  }

  fullDay(dayNumber){  // full day forcast on click
    if(this.state.day){
      this.setState({
          day: false
        });
    }else{
      this.setState({
          day: true,
          clicked: dayNumber
        });
    }
  }

  showDayWiseWeather(count){
    const a     = this.weatherData;
    const dateSelected = new Date( a.list[ this.state.clicked * count ].dt_txt ).toString().split(' ')[0];
    let dayData = Object.keys(a.list)
                  .map( (i) =>  { let currentDay  = new Date( a.list[i].dt_txt ).toString().split(' ')[0];
                                  if( a.list[i] && (dateSelected === currentDay) ) 
                                    { 
                                      return (<Tab 
                                              classes="col-md-2 col-sm-6 col-xs-6 text-center tab_margin" 
                                              key={ i }
                                              day_or_Date={ currentDay }
                                              img_details={ { src:"http://openweathermap.org/img/w/"+( a.list[i].weather[0].icon )+".png",
                                                              alt: a.list[i].weather[0].main } }
                                              temp={ { min: a.list[i].main.temp_min.toFixed(1),
                                                      max: a.list[i].main.temp_min.toFixed(1) } }
                                              weather_details={ a.list[i].weather[0].description }
                                              day_details={ a.list[i].dt_txt.split(' ')[0] } />
                                              )
                                     }
                                    else{
                                      return '';
                                    }
                                  }
                      );
    return (<div>
                <h3 className="text-center grey-border-1px">
                  { a.city.name + ', ' + a.city.country } 
                  - 
                  { new Date( a.list[this.state.clicked * count].dt_txt ).toString().split(' ')[0] }
                </h3>
    
                <p className="text-center" >
                  <b onClick={(e)=>this.fullDay()} className="cursor-pointer color-red" >
                    <span className="leftArrow">&#8592; </span>  
                    Click here to return to weekly weather
                  </b>
                </p>
    
                <div className="row">
                { dayData }
                </div>
              </div>);
  }

  // count - Array length weather data 
  showWholeWeekWeather(count){
    const a         = this.weatherData;
    const weekData  = [];
    for(let i=0; i<a.list.length; i++)
    {
      if( i*count >= a.list.length ){ break; }
      
      let currentDay  = new Date( a.list[ i * count ].dt_txt ).toString().split(' ')[0];
      let prevDay     = weekData[i-1] ? weekData[i-1].props.day_details : '';
      
      if( currentDay === prevDay ){ continue; }
      
      weekData.push(<Tab 
                    classes="col-md-2 col-sm-6 col-xs-6 text-center tab_margin tab" 
                    key={ i*count }
                    onClick={ (e) => this.fullDay(i) }
                    day_or_Date={ currentDay }
                    img_details={ { src:"http://openweathermap.org/img/w/"+( a.list[i*count].weather[0].icon )+".png",
                                    alt: a.list[i].weather[0].main } }
                    temp={ { min: (a.list[i*count].main.temp_min).toFixed(1),
                            max: (a.list[i*count].main.temp_min).toFixed(1) } }
                    weather_details={ a.list[i*count].weather[0].description }
                    day_details={ a.list[i*count].dt_txt.split(' ')[0] } />
                    );
      };

      return (<div>
                <h3 className="text-center grey-border-1px" >
                  { a.city.name + ', ' + a.city.country } 
                  &nbsp;- Weekly Weather
                </h3>
                  <p className="text-center">
                    <b>Click below to see full day forecast</b>
                  </p>
                  <div className="row">
                    { weekData }
                  </div>
              </div>);
  }

  render() {
    const weatherData = this.weatherData;
    const count       = ( weatherData.cnt !== undefined ) 
                          ? Math.floor( weatherData.cnt - weatherData.cnt % 5 ) / 5 
                          : 1;  // data available only for 5 days from api
    let   weatherTabs = '';

    if(!this.state.day && weatherData.list !== undefined){
      // Data shown on load
      weatherTabs = this.showWholeWeekWeather(count);
    }else if(weatherData.list !== undefined){
      // Full day forecast on clicking particular day
      weatherTabs = this.showDayWiseWeather(count);
    }
    
    return (<div className="col-md-12 col-sm-12 col-xs-12" >
             { weatherTabs }
            </div>)
  }
}

export default Fetch;