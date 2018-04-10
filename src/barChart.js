import React, { Component } from 'react';
import {HorizontalBar} from "react-chartjs-2";
import 'chartjs-plugin-datalabels';

export default class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barData : null
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    refactorData(data) {
        let dataCounts = data.counts
        let dataLabels = data.labels
        let dataColors = data.colors

        // If weird bug when slider is at time position 0 occurs then
        // set barData inputs to empty data
        if (dataLabels[0] === dataLabels[1]) {
            dataLabels = []
            dataCounts = []
            dataColors = []
        }

        // Prepare the colors array for bar data
        let preparedColors = []
        dataColors.forEach(function(element){
            let colorString = "rgba("
            let colorValue = String(element[0]) +"," + String(element[1]) + "," + String(element[2]) + ",0.5)"
            preparedColors.push(colorString.concat(colorValue))
        })

        let preparedData = {
            labels: dataLabels,
            datasets: [
                    {
                    label: "Top 10 Ping Counts",
                    data : dataCounts,
                    backgroundColor : preparedColors,
                    borderWidth: 1
                }
            ]
            }
        

        return preparedData
    }

    _renderBar(barData) {
        return (
            <div>
                <h2>Ping Counter</h2>
                <HorizontalBar
                data={barData}
                width={100}
                height={90}    
                options={{
                    maintainAspectRatio: true,
                    scaleBeginAtZero : true,
                    plugins: {
                        datalabels: {
                            color: 'black'
                        }
                    },
                    legend : {
                        display: false
                    }
                }}
                />
            </div>
        )
    }

    render() {
        
        let barData = this.refactorData(this.props.data);
        console.log("Render data: ");
        console.log(barData);
        return (
            <div>
            {this._renderBar(barData)}
            </div>
   )}

};
