import React, { Component } from 'react'

import Map from "../Map/Map";

import Table from "../Table/Table";

export class ByArea extends Component {
    render() {
        const { data, metric } = this.props;

        const areas = [...new Set(data.map(item => item.areaName))];
        let casesByArea = {};

        areas.forEach(area => {
            casesByArea[area] = data.filter(item => item.areaName === area).reduce((a, b) => a + b[metric], 0);
        });

        return (
            <div>
                <Table casesByArea={casesByArea} />
                <Map casesByArea={casesByArea} />
            </div>
        )
    }
}

export default ByArea
