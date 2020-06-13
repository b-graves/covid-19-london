import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { csv } from "d3"

import "./App.css";

import Map from "./components/Map/Map";
import Slider from "./components/Slider/Slider";

const App = () => {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState()
  const [selectedMinDate, setSelectedMinDate] = useState()
  const [selectedMaxDate, setSelectedMaxDate] = useState()
  const [dates, setDates] = useState()
  const [maxValue, setMaxValue] = useState()

  useEffect(() => {
    csv('./phe_cases_london_boroughs.csv').then(data => {
      data = data.map(item => {
        return {
          areaName: item.area_name,
          date: new Date(item.date).getTime(),
          totalCases: parseInt(item.total_cases) || 0,
          newCases: parseInt(item.new_cases) || 0
        }
      });
      setData(data);

      const dates = [... new Set(data.map(item => item.date))];
      setDates(dates)

      setSelectedMinDate(Math.min(...dates))
      setSelectedMaxDate(Math.max(...dates))

      setMaxValue(Math.max(...data.map(item => item.totalCases)));
    })
  }, []);

  useEffect(() => {
    if (selectedMinDate && selectedMaxDate) {
      setCurrentData(data.filter(item => item.date >= selectedMinDate && item.date <= selectedMaxDate))
    }
  }, [data, selectedMinDate, selectedMaxDate]);

  return <div className="App">
    {
      currentData ?
        <div>
          <Slider data={data} dates={dates} selectedMinDate={selectedMinDate} selectedMaxDate={selectedMaxDate} setSelectedMinDate={setSelectedMinDate} setSelectedMaxDate={setSelectedMaxDate}/>
          <Map data={currentData} maxValue={maxValue} />
        </div>
        : null
    }

  </div>
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
