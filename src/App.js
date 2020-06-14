import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { csv } from "d3"

import "./App.css";

import ByArea from "./components/ByArea/ByArea";
import Chart from "./components/Chart/Chart";

import Timeline from "./components/Timeline/Timeline";

const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const App = () => {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState()
  const [selectedMinDate, setSelectedMinDate] = useState()
  const [selectedMaxDate, setSelectedMaxDate] = useState()
  const [dates, setDates] = useState()

  const [keyDates, setKeyDates] = useState([]);
  const [currentKeyDates, setCurrentKeyDates] = useState();

  const [metric, setMetric] = useState("newCases")

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

      setSelectedMinDate(0)
      setSelectedMaxDate(dates.length - 1)
    })
  }, []);

  useEffect(() => {
    csv('./key_dates.csv').then(keyDates => {
      keyDates = keyDates.map(item => {
        return {
          name: item.name,
          date: new Date(item.date).getTime(),
          tweetId: item.tweetId,
          description: item.description
        }
      });
      setKeyDates(keyDates);
    })
  }, []);

  useEffect(() => {
    if (selectedMinDate !== undefined && selectedMaxDate !== undefined) {
      const startDate = new Date(dates[selectedMinDate]);
      const endDate = addDays(startDate, selectedMaxDate - selectedMinDate)

      const currentData = data.filter(item => item.date >= startDate.getTime() && item.date <= endDate.getTime())
      setCurrentData(currentData)

      const currentKeyDates = keyDates.filter(item => item.date >= startDate.getTime() && item.date <= endDate.getTime())
      setCurrentKeyDates(currentKeyDates)

    }
  }, [data, keyDates, selectedMinDate, selectedMaxDate, dates]);

  return <div className="App">
    {
      currentData ?
        <div>
          <button onClick={() => setMetric("newCases")}>New Cases</button>
          <button onClick={() => {
            setMetric("totalCases");
            setSelectedMinDate(dates.length - 1);
            setSelectedMaxDate(dates.length - 1)
          }}>Total Cases</button>

          <Chart data={data} dates={dates} selectedMinDate={selectedMinDate} selectedMaxDate={selectedMaxDate} setSelectedMinDate={setSelectedMinDate} setSelectedMaxDate={setSelectedMaxDate} keyDates={keyDates} metric={metric} allowRange={metric !== "totalCases"} />
          <ByArea data={currentData} metric={metric} />
        </div>
        : null
    }

  </div>
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
