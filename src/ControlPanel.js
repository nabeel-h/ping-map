import React, { Component } from 'react';
import json_data from './top_10_coords.json';
import range from 'lodash/range';

const store_map = json_data.store_map;
const time_map = json_data.time_map;

class ControlPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      time_state_id : 0
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
        <p>{this.props.settings[key]}</p>
        
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
        <p>{time_map[this.props.settings[key]]}</p>
      </div>
    );
  }

  /*
  _renderPlayButton(key) {
    return (
      <div className = "play">
        <button 
        type="button"
        onClick= { this.onPlayClick.bind(this)
        }>
          Click Play!
        </button>
      </div>
    )

  }

  
  onPlayClick(e) { 
    var add_id = this.state.time_state_id;

    this.setState= {
      time_state_id : add_id + 1
    };

    console.log(this.state.time); 
  }

  */


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
