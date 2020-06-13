import React, { Component } from 'react';
import { Histoslider } from "histoslider"

import "./Slider.css"

import { AutoSizer } from 'react-virtualized';

const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Oct", "Nov", "Dec"]

export class Slider extends Component {
    render() {
        const { dates, data, selectedMinDate, selectedMaxDate, setSelectedMinDate, setSelectedMaxDate } = this.props;
        return (
            <div>
                <div className="slider__container">
                    <AutoSizer>
                        {(({ width, height }) => width === 0 || height === 0 ? null : (
                            <Histoslider
                                // An array of objects to create the histogram
                                data={dates.map((date, index) => {
                                    const y = data.filter(item => item.date === date).reduce((a, b) => a + b.newCases, 0);
                                    return {
                                        x0: index,
                                        x: index + 1,
                                        y
                                    }
                                })}
                                width={width}
                                height={height}
                                barStyle={{
                                    rx: 0,
                                    ry: 0
                                }}
                                // How much to pad the slider and histogram by, defaults to 20
                                barPadding={0}
                                // // The extent of the selection, this doesn't have to be sorted (and you shouldn't sort it to store it)
                                selection={[dates.indexOf(selectedMinDate), dates.indexOf(selectedMaxDate)]}
                                // A function to handle a change in the selection
                                onChange={selection => {
                                    setSelectedMinDate(dates[Math.round(selection[0])]);
                                    setSelectedMaxDate(dates[Math.round(selection[1])]);
                                }}
                                showLabels={false}
                            />
                        ))}
                    </AutoSizer>

                </div>
                <div>
                    {new Date(selectedMinDate).getDate()+" "+months[new Date(selectedMinDate).getMonth()]}
                </div>
                <div>
                    {new Date(selectedMaxDate).getDate()+" "+months[new Date(selectedMaxDate).getMonth()]}
                </div>
            </div>


        )
    }
}

export default Slider
