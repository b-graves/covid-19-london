import React, { Component } from 'react'

import {
    PieChart, Pie as Slice, Legend, Tooltip,
  } from 'recharts';

export class Pie extends Component {
    render() {
        const { casesByArea } = this.props;

        let areas = Object.keys(casesByArea);

        areas.sort(function (a, b) { return casesByArea[b] - casesByArea[a] });

        const chartData = areas.map(area => {return {area, cases: casesByArea[area]}}).filter(item => item.cases !== 0)

        let renderLabel = (entry) => {
            return entry.area;
        }

        return (
            <div>
                <PieChart width={400} height={400}>
                    <Slice dataKey="cases" isAnimationActive={true} data={chartData} cx={200} cy={200} outerRadius={80} fill="#8884d8" label={renderLabel} />
                </PieChart>
            </div>
        )
    }
}

export default Pie
