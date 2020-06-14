import React, { Component } from 'react'

import FlipMove from 'react-flip-move';

export class Table extends Component {
    render() {
        const { casesByArea } = this.props;

        let areas = Object.keys(casesByArea);

        areas.sort(function (a, b) { return casesByArea[b] - casesByArea[a] });

        return (
            <div>
                <FlipMove>
                    {areas.map(area =>
                        <div key={area}>
                            {area} {casesByArea[area]}
                        </div>)}
                </FlipMove>
            </div>
        )
    }
}

export default Table
