import React, { Component } from 'react'

import {
    PieChart, Pie as Slice, Legend, Tooltip, Cell
} from 'recharts';


import { AutoSizer } from 'react-virtualized';

export class Pie extends Component {
    render() {
        const { casesByArea, activeArea, setActiveArea } = this.props;

        let areas = Object.keys(casesByArea);

        areas.sort(function (a, b) { return casesByArea[b] - casesByArea[a] });

        const chartData = areas.map(area => { return { area, cases: casesByArea[area] } }).filter(item => item.cases !== 0)


        return (
            <div className="pie__container">
                <AutoSizer>
                    {(({ width, height }) => width === 0 || height === 0 ? null : (
                        <PieChart width={width} height={width} >
                            <Slice dataKey="cases" isAnimationActive={false} data={chartData} labelLine={false}  outerRadius={"100%"} fill="#8884d8" label={(entry) => entry.area === activeArea ? entry.area : ""}>
                                {
                                    chartData.map((entry, index) => <Cell onMouseEnter={() => setActiveArea(entry.area)} onMouseLeave={() => setActiveArea(null)} key={`piecell-${index}`} fill={entry.area === activeArea ? "skyblue" : "grey"} />)
                                }
                            </Slice>
                        </PieChart>
                    ))}
                </AutoSizer>
            </div>

        )
    }
}

export default Pie
