import React, { Component } from 'react'

import FlipMove from 'react-flip-move';


export class Table extends Component {
    render() {
        const { casesByArea, activeArea, setActiveArea } = this.props;

        let areas = Object.keys(casesByArea);

        areas.sort(function (a, b) { return casesByArea[b] - casesByArea[a] });

        const chartData = areas.map(area => {return {area, cases: casesByArea[area]}}).filter(item => item.cases !== 0)

        return (
            <div>
                <FlipMove>
                    {areas.map(area =>
                        <div key={area} onMouseEnter={() => setActiveArea(area)} onMouseLeave={() => setActiveArea(null)} style={{backgroundColor: area === activeArea ? "skyblue" : null}}>
                            {area} {casesByArea[area]}
                        </div>)}
                </FlipMove>
            </div>
        )
    }
}

export default Table
