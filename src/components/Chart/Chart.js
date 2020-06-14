import React, { Component } from 'react';

import "./Chart.css"

import {
    ComposedChart, Bar, Scatter, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea
} from 'recharts';

import { AutoSizer } from 'react-virtualized';

import { TwitterTweetEmbed } from 'react-twitter-embed';

const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Oct", "Nov", "Dec"]




export class Chart extends Component {

    state = {
        selecting: false,
        refAreaLeft: '',
        refAreaRight: '',
    }

    selectRange() {
        let { refAreaLeft, refAreaRight, data } = this.state;

        this.setState(() => ({
            refAreaLeft: '',
            refAreaRight: '',
            selecting: false
        }));

        if (refAreaLeft === refAreaRight || refAreaRight === '') {

            this.props.setSelectedMinDate(refAreaLeft)
            this.props.setSelectedMaxDate(refAreaLeft)

            return;
        }

        // xAxis domain
        if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

        this.props.setSelectedMinDate(refAreaLeft)
        this.props.setSelectedMaxDate(refAreaRight)
    }

    selectDateDown(e) {
        if (e) {
            this.props.setSelectedMinDate(e.activeLabel)
            this.props.setSelectedMaxDate(e.activeLabel)
            this.setState({ selecting: true })
        }
    }

    selectDateMove(e) {
        if (e && this.state.selecting) {
            this.props.setSelectedMinDate(e.activeLabel)
            this.props.setSelectedMaxDate(e.activeLabel)
        }
    }

    selectDateUp(e) {
        if (e) {
            this.props.setSelectedMinDate(e.activeLabel)
            this.props.setSelectedMaxDate(e.activeLabel)
            this.setState({ selecting: false })
        }
    }

    isSelected = (entry, index) => {
        let { refAreaLeft, refAreaRight } = this.state;
        if (refAreaLeft === '' && refAreaRight === '') {
            return entry.active
        } else {
            if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
            return refAreaLeft <= index && refAreaRight >= index
        }

    }

    render() {
        const { dates, data, selectedMinDate, selectedMaxDate, keyDates, metric, allowRange } = this.props;

        const chartData = dates.map((date, index) => {
            const cases = data.filter(item => item.date === date).reduce((a, b) => a + b[metric], 0);

            const active = index >= selectedMinDate && index <= selectedMaxDate;

            let item = {
                date,
                cases,
                active,
                dateReal: new Date(date),
            }

            const keyDate = keyDates.find(keyDate => keyDate.date === date)

            if (keyDate) {
                item.keyDate = true;
                item.keyDateInfo = keyDate;
            }

            return item
        })

        const CustomTooltip = ({ active, payload, label }) => {
            if (active || this.state.selecting) {
                const item = chartData[label];
                return (
                    item ?
                        <div className="custom-tooltip">
                            <div>
                                {new Date(item.date).getDate() + " " + months[new Date(item.date).getMonth()]}
                            </div>
                            <div>
                                {item.cases} Cases
                        </div>
                            {item.keyDate ?
                                <div>
                                    {item.keyDateInfo.description}
                                    <TwitterTweetEmbed
                                        tweetId={item.keyDateInfo.tweetId}
                                        options={{
                                            cards: 'hidden',

                                        }}
                                    />
                                </div>
                                :
                                null
                            }
                        </div>
                        :
                        null

                );
            }

            return null;
        };

        return (
            <div>
                <div className="chart__container">
                    <AutoSizer>
                        {(({ width, height }) => width === 0 || height === 0 ? null : (
                            <ComposedChart width={width} height={height}
                                data={chartData}
                                onMouseDown={allowRange ? e => this.setState({ refAreaLeft: e.activeLabel, selecting: true }) : this.selectDateDown.bind(this)}
                                onMouseMove={allowRange ? e => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel }) : this.selectDateMove.bind(this)}
                                onMouseUp={allowRange ? this.selectRange.bind(this) : this.selectDateUp.bind(this)}

                            >

                                <Bar
                                    dataKey="cases"
                                >
                                    {
                                        chartData.map((entry, index) => (
                                            <Cell cursor="pointer" fill={this.isSelected(entry, index) ? 'red' : 'black'} key={`cell-${index}`} />
                                        ))
                                    }
                                </Bar>
                                <YAxis />

                                <Scatter name="red" dataKey="keyDate" fill="red" />

                                <Tooltip
                                    active={true}
                                    wrapperStyle={{
                                        visibility: 'visible',
                                    }}
                                    allowEscapeViewBox={{ x: false, y: false }}
                                    content={<CustomTooltip />}
                                />
                            </ComposedChart>
                        ))}
                    </AutoSizer>

                </div>
                <div>
                    {new Date(dates[selectedMinDate]).getDate() + " " + months[new Date(dates[selectedMinDate]).getMonth()]}
                </div>
                <div>
                    {new Date(dates[selectedMaxDate]).getDate() + " " + months[new Date(dates[selectedMaxDate]).getMonth()]}
                </div>
            </div>


        )
    }
}

export default Chart
