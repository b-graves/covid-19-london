import React, { Component } from 'react'

import FlipMove from 'react-flip-move';

import "./Table.css";

import { scaleLinear, scaleQuantile } from "d3-scale";

export class Table extends Component {
    render() {
        const { casesByArea, activeArea, setActiveArea } = this.props;

        let areas = Object.keys(casesByArea);

        areas.sort(function (a, b) { return casesByArea[b] - casesByArea[a] });

        const chartData = areas.map(area => { return { area, cases: casesByArea[area] } }).filter(item => item.cases !== 0)

        const maxValue = Math.max(...Object.values(casesByArea))
        const minValue = Math.min(...Object.values(casesByArea))
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

        const sizeScale = scaleLinear()
            .domain([minValue, Math.ceil(maxValue + 1)])
            .range([
                60,
                180
            ]);

        return (
            <div className="cases-table">
                <FlipMove>
                    {areas.map(area =>
                        <div className="cases-table__item" key={area} onMouseEnter={() => setActiveArea(area)} onMouseLeave={() => setActiveArea(null)} style={{ fontSize: sizeScale(casesByArea[area]) + "%", backgroundColor: area === activeArea ? colorScale(casesByArea[area]) : null, color: area === activeArea ? labelScale(casesByArea[area]) : null }}>
                            {area}-{casesByArea[area] % 1 === 0 ? casesByArea[area] : casesByArea[area].toFixed(2)}
                        </div>)}
                </FlipMove>
            </div>
        )
    }
}

export default Table
