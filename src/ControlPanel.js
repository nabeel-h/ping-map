import React, { Component } from 'react';
import json_data from './top_10_coords.json';
import range from 'lodash/range';
import BarChart from './barChart.js';

const store_map = json_data.store_map;
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

  _renderStores(store_object) {
    var rows = [];
    for (var i = 0; i < store_object.length; i++) {
      let temp_name = store_object[i][0]
      let temp_color = store_object[i][1]
      rows.push(this._renderToggle(temp_name, temp_name))
    }

    return (
      <div>
        {rows}
      </div>
    )
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
        <p>{time_map[this.props.settings[key]]}</p>
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
