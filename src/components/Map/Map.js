import React, { Component } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Annotation } from "react-simple-maps";

import { scaleQuantile } from "d3-scale";

import { geoCentroid } from "d3-geo";

const geoUrl = "https://vega.github.io/vega-datasets/data/londonBoroughs.json";

export class Map extends Component {
    render() {
        const { casesByArea, activeArea, setActiveArea } = this.props;

        const maxValue = Math.max(...Object.values(casesByArea))
        const colorScale = scaleQuantile()
            .domain(Array.from(Array(Math.ceil(maxValue)).keys()))
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
                                        <Geography onMouseEnter={() => setActiveArea(geo.id)} onMouseLeave={() => setActiveArea(null)} key={geo.rsmKey} geography={geo} fill={geo.id === activeArea ? "skyblue" : colorScale(value)} stroke="#000" strokeWidth={1} />
                                    )
                                })}
                                {geographies.map(geo => {
                                    const centroid = geoCentroid(geo);
                                    return (
                                        geo.id === activeArea ?
                                        <g key={geo.rsmKey + "-name"}>
                                            <Marker onMouseEnter={() => setActiveArea(geo.id)} coordinates={centroid}>
                                                <text y="2" fontSize={14} textAnchor="middle">
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
