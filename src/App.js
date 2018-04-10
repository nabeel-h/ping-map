import React, { Component } from 'react';
import autobind from 'react-autobind';
import ControlPanel from './ControlPanel';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import json_data from './top_10_coords.json';
import 'mapbox-gl/dist/mapbox-gl.css';
import BarChart from './barChart.js';

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


function findTimeIndex(data, intTime) {
  const index = data.findIndex(ping => ping[1] == intTime);
  console.log("This is the slicing index: " + index);
  return data.slice(0,index);
};

function findBarData(data,store_map) {
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
      let storeCount = parseInt(sortedAscData[i]);
      // Because Counter is still unsorted, we look up that index position
      // since it maps correcly with store_map input
      let counter_index = counter.findIndex(ping => ping == storeCount);
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

function getRandomBarData(){
  const return_data = {
    counts : Array.from({length: 10}, () => Math.floor(Math.random() * 10)),
    colors : ['rgba(255,99,132,0.2)','rgba(105,50,190,1)'],
    names : ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October']
  }

  return return_data;
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
    this.initStateData();
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

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
    console.log("Slider value changed:" );
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
          <div>
            <BarChart data={this.state.barData}/>
          </div>
        </div>
        
      </div>
    );
  }
}



export default App;
