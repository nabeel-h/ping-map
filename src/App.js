import React, { Component } from 'react';
import autobind from 'react-autobind';
import ControlPanel from './ControlPanel';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import json_data from './top_10_coords.json';
import 'mapbox-gl/dist/mapbox-gl.css';
import BarChart from './barChart.js';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibmFiZGV2IiwiYSI6ImNqZXJya25ocTBseGozM3A0Nnh4ZzU5b3kifQ.0g6m5X8PUkXrdZk3Qe4Lpw'; // eslint-disable-line

// List of 10 colors for our 10 store chains.
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

// Maps colors from list above to each store in store_map
var store_iterator = 0;
Object.keys(store_map).forEach(function(key) {
  const store_name = store_map[key];
  store_map[key] = [store_name,colors[store_iterator]];
  store_iterator = store_iterator + 1;
});

// For slicing up data set according to time
function findTimeIndex(data, intTime) {
  const index = data.findIndex(ping => ping[1] == intTime);
  console.log("Generating data according to time index: " + index);
  return data.slice(0,index);
};

// For creating summary data for bar plot
function findBarData(data,store_map) {
  console.log("Generating bar data");
  let preparedData = {
    counts : [],
    labels: [],
    colors: []
  }

  // Array of 10 stores. Find better way to create it.
  const counter = [0,0,0,0,0,0,0,0,0,0]
  data.forEach(function(element){
    // Iterates over list, and counts store_ids for counter
    let store_id = element[2];
    counter[store_id] = counter[store_id] + 1
  });

  // Sorts data by ascending
  let sortedAscData = counter.slice()
  sortedAscData.sort(function sortNumber(a,b) {
      return b - a;
  })

  // Using the items ranks from sorting, fill up preparedData
  for (var i = 0; i < counter.length; i++){
      let storeCount = parseInt(sortedAscData[i],10);
      // Because Counter is still unsorted, we look up that index position
      // since it maps correcly with store_map input
      let counter_index = counter.findIndex(store => store == storeCount);
      let label = store_map[counter_index][0];
      let color = store_map[counter_index][1];

      let preparedCounts = preparedData.counts;
      let preparedLabels = preparedData.labels;
      let preparedColors = preparedData.colors;

      // Append each list with row data
      preparedCounts.push(storeCount);
      preparedLabels.push(label);
      preparedColors.push(color);
  }

  return preparedData;
};

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    viewport: {
      ...DeckGLOverlay.defaultViewport,
      width:500,
      height:500
    },
    data: null,
    barData: null,
    settings: {
      time:1,
      showStores: true
      }
    };
    autobind(this);
  }

  componentWillMount(){
    // Sets init state data in Will mount so data will be passed properly
    // from state to props (state is 1 step behind)
    this.initStateData();
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  // sets initial state data
  initStateData = (data) => {
    let initData = findTimeIndex(json_data.data, 1);
    let initBarData = findBarData(initData, store_map);

    this.setState({
      data: initData,
      barData : initBarData
    });
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
    console.log("Settings changed!");
    console.log(settings);

    if (!settings.time) {
      settings.time = this.state.settings.time
    };

    let new_data = findTimeIndex(json_data.data, settings.time);
    let new_barData = findBarData(new_data,store_map);    

    this.setState({
      settings : {...this.state.settings, ...settings},
      data : new_data,
      barData : new_barData
    });

    
  }

  

  render() {
    const {viewport, data, settings, barData} = this.state;
    console.log("This is what's being passed as barData:");
    console.log(barData);
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
            storeMap = {store_map}
            showScatterLayer = {settings.showStores}
          />
         </MapGL>

        <div className="control-panel">
          <h1>Ping Mapper</h1>
          <p>Tool for visualizing phone pings. Drag the time slider below.</p>
          <ul>
            <li>Between period {time_map[0]} to {time_map[time_map.length-1]}</li>
            <li>There is a total of {json_data.data.length} pings in this period.</li>
            <li>The pings are each attributed to one of {store_map.length} unique store chains in this visualization.</li>

          </ul>
          <hr />

          <ControlPanel 
          settings={settings} 
          onChange={this._updateSettings} 
          store_map={this.store_map} 
          time_map={this.time_map} />
          <div>
            <BarChart data={this.state.barData}/>
          </div>
        </div>
        
      </div>
    );
  }
}



export default App;
