import React, { Component } from 'react';
import json_data from './top_10_coords.json';

const time_map = json_data.time_map;

class ControlPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      time_map: 'what'
    }
  }

  _renderToggle(key, displayName) {
    return (
      <div className = "input">
        <label>{displayName}</label>
        <input 
        type="checkbox"
        checked={this.props.settings[key] || false}
        onChange= {e => this.props.onChange({[key]:e.target.checked})}
        />
        </div>
    );
  }

  _renderSlider(key, displayName, props) {
    
    return (
      <div className = "input">
        <label>{displayName}</label>
        <input
          type="range"
          {...props}
          value={this.props.settings[key] || 0}
          onChange={e => this.props.onChange({[key]: e.target.value})}
          />
        <p align="center">CURRENT TIME : {time_map[this.props.settings[key]]}</p>
      </div>
    );
  }

  render() {
    const slider_max = time_map.length - 1;
    return (
      <div>
        {this._renderToggle('showStores', 'Show pings')}
        {this._renderSlider('time', 'time', {min: 0, max:slider_max, step:1.0})} 
        
      </div>
    );
  }
}

export default ControlPanel;
