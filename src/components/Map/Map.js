import React, { Component } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Annotation } from "react-simple-maps";

import { scaleLinear, scaleQuantile } from "d3-scale";

import { geoCentroid } from "d3-geo";

import "./Map.css";

const geoUrl = "https://vega.github.io/vega-datasets/data/londonBoroughs.json";



export class Map extends Component {
    render() {
        const { casesByArea, activeArea, setActiveArea } = this.props;

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
                        {({ geographies }) => (
                            <>
                                {geographies.map(geo => {
                                    const value = casesByArea[geo.id];
                                    return (
                                        <Geography onMouseEnter={() => setActiveArea(geo.id)} onMouseLeave={() => setActiveArea(null)} key={geo.rsmKey} geography={geo} fill={colorScale(value)} stroke={"#fff"} strokeWidth={0} />
                                    )
                                })}
                                {geographies.map(geo => {
                                    const centroid = geoCentroid(geo);
                                    const value = casesByArea[geo.id];
                                    return (
                                        activeArea === geo.id ?
                                            <g key={geo.rsmKey + "-name"}>
                                                <Marker onMouseEnter={() => setActiveArea(geo.id)} coordinates={centroid}>
                                                    <text y="0" fontSize={26} textAnchor="middle" fill={labelScale(value)} >
                                                        {geo.id}
                                                    </text>
                                                </Marker>

                                  ))}
                                        </g>
                                            : null
                                    );
                                })}
                            </>
                        )}
                    </Geographies>

                </ZoomableGroup>
            </ComposableMap>
        )
    }
}

export default Map
