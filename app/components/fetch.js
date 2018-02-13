import React from 'react';
import ReactDOM from 'react-dom';
import Repeat from 'react-repeat-component';

class Fetch extends React.Component {
  constructor(){
    super();
    this.fullDay = this.fullDay.bind(this);
    this.state = {
      weatherData: {},
      day: false,
      clicked: 1
    };
  }

  componentWillMount(){  /// fetch data from api for whole week
    let lat = this.props.lat;  // latitude
    let lon = this.props.lon;  // longitue
    fetch("http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&units=metric&appid=3279b275644f5e71cba5375e72028012")
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
        this.setState({
          weatherData: data
        });
      })
      .catch(function(error) {
        console.log(`Error: ${error.message}`);
      })
  }

  fullDay(){  // full day forcast on click
    if(this.state.day){
      this.setState({
          day: false
        });
    }else{
      this.setState({
          day: true,
          clicked: arguments[0] //
        });
    }
    
  }

  render() {
    let a = this.state.weatherData;
    let count = a.cnt!=undefined ? Math.floor(a.cnt-a.cnt%5)/5 : 1;  // data available only for 5 days from api
    let e ='';


    if(!this.state.day){
      // Data shown on load
      e = <div>
            <h3 className="text-center" style={{border: '1px solid #ccc'}} >{a.city!=undefined ? a.city.name+', '+a.city.country : ''} - Weekly Weather</h3>
              <p className="text-center"><b>Click the day tab to see full forecast</b></p>
             <Repeat times={a.cnt<40 ? 4 : 5} className="row">

              {(i) => (
              <div className="col-md-2 col-sm-6 col-xs-6 text-center tab_margin tab" key={i*count} onClick={(e)=>this.fullDay(i)}>
                <p className="day_Name_grey"> {new Date(a.list!=undefined ? a.list[i*count].dt_txt : '').toString().split(' ')[0]} </p>
                <img src={"http://openweathermap.org/img/w/"+(a.list!=undefined ? a.list[i*count].weather[0].icon : '')+".png"} alt="sunny" />
                <p>{a.list!=undefined ? (a.list[i*count].main.temp_max).toFixed(1) : ''}°C  <span className="temp_grey">{a.list!=undefined ? (a.list[i*count].main.temp_min).toFixed(1) : ''}°C</span></p>
                <p style={{textTransform: 'capitalize'}}>{a.list!=undefined ? a.list[i*count].weather[0].description : ''}</p>
                <p>{a.list!=undefined ? a.list[i*count].dt_txt.split(' ')[0] : ''}</p>
              </div>
              )}

             </Repeat> 
          </div>;
    }else{
      // Full day forecast on clicking particular day
      e = <div>
            <h3 className="text-center" style={{border: '1px solid #ccc'}} >
              {a.city!=undefined ? a.city.name+', '+a.city.country : ''} - {new Date(a.list!=undefined ? a.list[this.state.clicked*count].dt_txt : '').toString().split(' ')[0]}
            </h3>

            <p className="text-center" ><b onClick={(e)=>this.fullDay()} style={{color: 'red', cursor: 'pointer'}} >
              <span className="leftArrow">&#8592; </span>  Click me  to revert to weekly weather</b>
            </p>

              <div className="row">
              { Object.keys(a.list).map(
                  (i) => (new Date(a.list!=undefined ? a.list[this.state.clicked*count].dt_txt : '').toString().split(' ')[0] == (new Date(a.list!=undefined?a.list[i].dt_txt:'')).toString().split(' ')[0]) 
                    ?
                          (
                          <div className="col-md-2 col-sm-6 col-xs-6 text-center tab_margin" key={i} >
                            <p className="day_Name_grey">{new Date(a.list!=undefined ? a.list[i].dt_txt : '').toString().split(' ')[0]}</p>
                            <img src={"http://openweathermap.org/img/w/"+(a.list!=undefined ? a.list[i].weather[0].icon : '')+".png"} alt="sunny" />
                            <p>{a.list!=undefined ? (a.list[i].main.temp_max).toFixed(1) : ''}°C  
                              <span className="temp_grey">{a.list!=undefined ? (a.list[i].main.temp_min).toFixed(1) : ''}°C</span>
                            </p>
                            <p style={{textTransform: 'capitalize'}}>{a.list!=undefined ? a.list[i].weather[0].description : ''}</p>
                            <p>{a.list!=undefined ? a.list[i].dt_txt : ''}</p>
                          </div>
                          )
                    : '')
              }
              </div>
          </div>;
    }
    
    return (<div className="col-md-12 col-sm-12 col-xs-12" >
             {e}
            </div>)
  }
}

export default Fetch;