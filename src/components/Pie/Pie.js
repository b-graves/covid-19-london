import React, { Component } from 'react'

import {
    PieChart, Pie as Slice, Legend, Tooltip, Cell
} from 'recharts';

import { scaleLinear, scaleQuantile } from "d3-scale";

import { AutoSizer } from 'react-virtualized';

export class Pie extends Component {
    render() {
        const { casesByArea, activeArea, setActiveArea } = this.props;

        let areas = Object.keys(casesByArea).reverse();

        areas.sort(function (a, b) { return casesByArea[a] - casesByArea[b] });

        const chartData = areas.map(area => { return { area, cases: casesByArea[area] } }).filter(item => item.cases !== 0)

        const maxValue = Math.max(...Object.values(casesByArea))
        const colorScale = scaleLinear()
            .domain([0, Math.ceil(maxValue + 1)])
            .range([
                "#c9daf8ff",
                "#1155ccff"
            ]);

        const labelScale = scaleQuantile()
            .domain([0, Math.ceil(maxValue + 1)])
            .range([
                "#000",
                "#fff"
            ]);


        const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({
            cx, cy, midAngle, innerRadius, outerRadius, area, cases, percent
        }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
                <text x={x} y={y} fontSize={24} fill={labelScale(cases)} textAnchor={'middle'} dominantBaseline="central">
                    {area === activeArea ? area + " " + Math.round(percent*100)+ "%" : null}
                </text>
            );
        };

        return (
            <div className="pie__container">
                <AutoSizer>
                    {(({ width, height }) => width === 0 || height === 0 ? null : (
                        <PieChart width={width} height={width} >
                            <Slice minAngle={1} startAngle={90} endAngle={450} dataKey="cases" isAnimationActive={false} data={chartData} labelLine={false} outerRadius={"100%"} fill="#8884d8" stroke="#efefef" paddingAngle={0} label={renderCustomizedLabel}>
                                {
                                    chartData.map((entry, index) => <Cell onMouseEnter={() => setActiveArea(entry.area)} onMouseLeave={() => setActiveArea(null)} key={`piecell-${index}`} fill={colorScale(entry.cases)} />)
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
