import React from 'react';
import ReactDOM from 'react-dom';
import Geo from './components/geo.js';

class Weather extends React.Component {

  render(){
      return (<Geo />);
  }
}

// ========================================

ReactDOM.render(
  <Weather />,
  document.getElementById('tabs')
);