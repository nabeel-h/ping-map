import React, { Component } from 'react';
import autobind from 'react-autobind';
import ControlPanel from './ControlPanel';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import json_data from './top_10_coords.json';
import 'mapbox-gl/dist/mapbox-gl.css';


const MAPBOX_TOKEN = 'pk.eyJ1IjoibmFiZGV2IiwiYSI6ImNqZXJya25ocTBseGozM3A0Nnh4ZzU5b3kifQ.0g6m5X8PUkXrdZk3Qe4Lpw'; // eslint-disable-line

var colors = [
  [230, 25, 75],
  [60, 180, 75],
  [255,225,25],
  [0, 130, 200],
  [245,130, 48],
  [145,30, 180],
  [70, 240, 240],
  [240, 50, 230],
  [210, 245, 60],
  [250, 190, 190]
];

const store_map = json_data.store_map;
const time_map = json_data.time_map;


var store_iterator = 0;
Object.keys(store_map).forEach(function(key) {
  const store_name = store_map[key];
  store_map[key] = [store_name,colors[store_iterator]];
  store_iterator = store_iterator + 1;
});


function findTimeIndex(ping_array, time_id) {
  const index = ping_array.findIndex(ping => ping[1] == time_id);
  console.log("This is the slicing index: " + index);
  return ping_array.slice(0,index);
};

/*
console.log("Store map: ");
console.log(store_map);
console.log("Time map: ");
console.log(time_map);
*/

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    viewport: {
      ...DeckGLOverlay.defaultViewport,
      width:500,
      height:500
    },
    data: findTimeIndex(json_data.data, 30),
    settings: {
      time:30,
      showStores: true
      }
    };
    autobind(this);
      
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
}

  _updateSettings(settings) {
    console.log("Updating time, showing all points up until: "+ time_map[settings.time]);
    let new_data = findTimeIndex(json_data.data, settings.time);
    this.setState({
      settings : {...this.state.settings, ...settings},
      data : new_data
    });
    
}

  render() {
    const {viewport, data, settings} = this.state;
    return (
      <div>  
        <MapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken= {MAPBOX_TOKEN}
          >
          <DeckGLOverlay
            viewport = {viewport}
            data = {data}
            radius = {30}
            pointColor = {store_map}
            showScatterLayer = {settings.showStores}
          />
         </MapGL>

        <div className="control-panel">
          <h1>Ping Mapper</h1>
          <p>Visualize phone pings between {time_map[0]} to {time_map[time_map.length-1]}.</p>
          <ul>
            <li>There are a total of {json_data.data.length} pings by the end of the period.</li>
            <li>There are {store_map.length} unique store chains.</li>

          </ul>
          <hr />

          <ControlPanel 
          settings={settings} 
          onChange={this._updateSettings} 
          store_map={this.store_map} 
          time_map={this.time_map} />
        </div>
      </div>
    );
  }
}



export default App;
