import React, { Component } from 'react';

class ControlPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      timeMap: null
    }
  }

  componentWillMount(){
    this.setState({
      timeMap : this.props.time_map
    })
  }

  componentDidMount() {

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
    let timeMap = this.state.timeMap;
    console.log("RENDER SLIDER");
    console.log(timeMap);
    
    return (
      <div className = "input">
        <label>{displayName}</label>
        <input
          type="range"
          {...props}
          value={this.props.settings[key] || 0}
          onChange={e => this.props.onChange({[key]: e.target.value})}
          />
        <p align="center">CURRENT TIME : {timeMap[this.props.settings[key]]}</p>
      </div>
    );
  }

  render() {
    let timeMap = this.state.timeMap;

    let slider_max = timeMap.length - 1;
    return (
      <div>
        {this._renderToggle('showStores', 'Show pings')}
        {this._renderSlider('time', 'time', {min: 0, max:slider_max, step:1.0})} 
        
      </div>
    );
  }
}

export default ControlPanel;
