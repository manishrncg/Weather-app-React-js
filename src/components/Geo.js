import React, { Component } from 'react';
import {geolocated} from 'react-geolocated';
import Fetch from './Fetch';

class Geo extends Component {

  render() {  // Geo location status and forwarding to Fetch component
    return !this.props.isGeolocationAvailable
      ? <div>Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
        ? <div>Geolocation is not enabled</div>
        : this.props.coords
          ? <Fetch lat={this.props.coords.latitude} lon={this.props.coords.longitude} />
          : <div>Getting the location data&hellip; </div>;
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Geo);