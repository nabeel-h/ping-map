import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

class DeckGLOverlay extends Component {
    static get defaultViewport() {
        return {
            longitude: -118.303397,
            latitude: 33.95,
            zoom: 9,
            maxZoom: 16,
            pitch: 0,
            bearing: 0
        };
    }

    render() {
        const {viewport, data, radius, storeMap, showScatterLayer} = this.props;

        if (!data) {
            return null;
        }


        const layer = new ScatterplotLayer({
            id: 'scatter-plot',
            data,
            visible: showScatterLayer,
            radiusScale: radius,
            radiusMinPixels: 1.0,
            pickable: true,
            onHover: info =>  { if (info.object != null) {storeMap[info.object[2]][0]} },
            getColor: d => storeMap[d[2]][1],
            getPosition: d => [d[0][0],d[0][1]],
            getRadius: d => 2.5,
        });

        return <DeckGL {...viewport} layers={[layer]} />;
    }
}

export default DeckGLOverlay;
