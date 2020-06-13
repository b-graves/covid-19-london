import React, { Component } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

import { scaleQuantile } from "d3-scale";

const geoUrl = "https://vega.github.io/vega-datasets/data/londonBoroughs.json";


export class Map extends Component {
    render() {
        const { data, maxValue } = this.props;
        const colorScale = scaleQuantile()
            .domain(Array.from(Array(maxValue).keys()))
            .range([
                "#ffedea",
                "#ffcec5",
                "#ffad9f",
                "#ff8a75",
                "#ff5533",
                "#e2492d",
                "#be3d26",
                "#9a311f",
                "#782618"
            ]);

        console.log(data)

        return (
            <ComposableMap
                projection="geoAzimuthalEqualArea"
                projectionConfig={{
                    rotate: [0.1, -51.4, 0.0],
                    scale: 55000
                }}
            >
                <ZoomableGroup zoom={1}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) => {

                            return geographies.map(geo => {
                                let value = 0;
                                const item = data.find(item => item.areaName === geo.id);
                                if (item) {
                                    value = item.totalCases;
                                }
                                return <Geography key={geo.rsmKey} geography={geo} fill={colorScale(value)} stroke="#000" strokeWidth={1} />
                            })
                        }
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        )
    }
}

export default Map
