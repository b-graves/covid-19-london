import React, { Component } from 'react';
import { RangeSlider } from 'reactrangeslider';

import "./Slider.css"

import { AutoSizer } from 'react-virtualized';

const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Oct", "Nov", "Dec"]

export class Slider extends Component {
    render() {
        const { dates, selectedMinDate, selectedMaxDate, setSelectedMinDate, setSelectedMaxDate } = this.props;

        return (
            <div>
                <RangeSlider
                    value={{ start: selectedMinDate, end: selectedMaxDate }}
                    afterChange={(newValue) => {
                        setSelectedMinDate(newValue.start)
                        setSelectedMaxDate(newValue.end)
                    }}
                    min={0}
                    max={dates.length}
                    step={1}
                />
                <div>
                    {new Date(dates[selectedMinDate]).getDate() + " " + months[new Date(dates[selectedMinDate]).getMonth()]}
                </div>
                <div>
                    {new Date(dates[selectedMaxDate - 1]).getDate() + " " + months[new Date(dates[selectedMaxDate - 1]).getMonth()]}
                </div>
            </div >
        )
    }
}

export default Slider
