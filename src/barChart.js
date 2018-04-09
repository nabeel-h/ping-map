import React, { Component } from 'react';
import {Bar} from "react-chartjs-2";

export default class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barData : null
        }
    }

    _createDataObject(input_bars) {
        const new_data = {
            labels: input_bars.names,
        datasets: [
            {
            label: 'My First dataset',
            backgroundColor: input_bars.colors,
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: input_bars.counts
                }
            ]
        }

        return new_data

    }

    componentDidMount() {
        let new_data = this._createDataObject([100,30,40,30,200,70,90,80,100,100])
        this.setState(
            {
                barData : null
            }
        )
    }

    _renderBar(barData) {
        return (
            <div>
                <h2>Bar</h2>
                <Bar
                data={barData}
                width={100}
                height={70}    
                options={{
                    maintainAspectRatio: true
                }}
                />
            </div>
        )
    }

    render() {

        let bar_data = this._createDataObject(this.props.input_data);

        return (
            <div>
            {this._renderBar(bar_data)}
            </div>
   )}

};
