import React, { Component } from 'react';

class Tab extends Component {
	render() {
		const { classes, onClick, day_or_Date, img_details, temp, weather_details, day_details } = this.props;
		return (
			<div className={ classes } onClick={ onClick } >
              <p className="day_Name_grey">
                { day_or_Date }
              </p>
              <img 
                src={ img_details.src } 
                alt={ img_details.alt } />
              <p>
                { temp.min }°C &nbsp;
                <span className="temp_grey">
                  { temp.max }°C
                </span>
              </p>
              <p className="text-capitalize">
                { weather_details }
              </p>
              <p>
                { day_details }
              </p>
            </div>
			);
	}
}

export default Tab;