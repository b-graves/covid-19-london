import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { csv } from "d3"

import "./App.css";

import Table from "./components/Table/Table";
import Pie from "./components/Pie/Pie";
import Map from "./components/Map/Map";
import Chart from "./components/Chart/Chart";
import Slider from "./components/Slider/Slider";

import Timeline from "./components/Timeline/Timeline";

import { Container, Row, Col } from 'reactstrap';

const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const adjustData = (item, populations, metric) => {
  const population = populations.find(population => population.borough === item.areaName)
  return {
    ...item, [metric]: item[metric] / population.population * 10000
  }
}

const App = () => {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState()
  const [chartData, setChartData] = useState()
  const [selectedMinDate, setSelectedMinDate] = useState()
  const [selectedMaxDate, setSelectedMaxDate] = useState()
  const [dates, setDates] = useState()

  const [keyDates, setKeyDates] = useState([]);
  const [currentKeyDates, setCurrentKeyDates] = useState();

  const [populations, setPopulations] = useState([]);

  const [adjustToPopulation, setAdjustToPopulation] = useState(false)

  const [metric, setMetric] = useState("newCases")

  const [casesByArea, setCasesByArea] = useState();

  const [activeArea, setActiveArea] = useState(null)

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
    csv('./populations.csv').then(populations => {
      setPopulations(populations)
    });
  }, []);

  useEffect(() => {
    if (selectedMinDate !== undefined && selectedMaxDate !== undefined) {
      const startDate = new Date(dates[selectedMinDate]);
      const endDate = addDays(startDate, selectedMaxDate - selectedMinDate)

      let currentData = data.filter(item => item.date >= startDate.getTime() && item.date <= endDate.getTime())

      if (adjustToPopulation && populations) {
        currentData = currentData.map(item => adjustData(item, populations, metric))
      }

      setCurrentData(currentData)

      const currentKeyDates = keyDates.filter(item => item.date >= startDate.getTime() && item.date <= endDate.getTime())
      setCurrentKeyDates(currentKeyDates)

      let chartData = data;
      if (adjustToPopulation && populations) {
        chartData = chartData.map(item => adjustData(item, populations, metric))
      }
      setChartData(chartData)

      const areas = [...new Set(currentData.map(item => item.areaName))];
      let casesByArea = {};

      areas.forEach(area => {
        casesByArea[area] = currentData.filter(item => item.areaName === area).reduce((a, b) => a + b[metric], 0);
      });

      setCasesByArea(casesByArea)
    }
  }, [data, keyDates, selectedMinDate, selectedMaxDate, dates, adjustToPopulation, populations, metric]);


  return <div className="App">
    {
      currentData ?
        <Container>
          <Row>
          <Col>
          <h1>COVID-19 in London</h1>
          </Col>
          <Col>
            <button onClick={() => setMetric("newCases")}>New Cases</button>
            <button onClick={() => {
              setMetric("totalCases");
              setSelectedMinDate(dates.length - 1);
              setSelectedMaxDate(dates.length - 1)
            }}>Total Cases</button>

            <button onClick={() => {
              setAdjustToPopulation(true)
            }}>Adjust</button>

            <button onClick={() => {
              setAdjustToPopulation(false)
            }}>Don't Adjust</button>
            </Col>
          </Row>
          <Row>

            <Col sm="10">
              <Row>
                <Col>
                  <Chart data={chartData} dates={dates} selectedMinDate={selectedMinDate} selectedMaxDate={selectedMaxDate} setSelectedMinDate={setSelectedMinDate} setSelectedMaxDate={setSelectedMaxDate} keyDates={keyDates} metric={metric} allowRange={metric !== "totalCases"} />
                </Col>
              </Row>
              <Row>
                <Col sm="4">
                  <Pie casesByArea={casesByArea} activeArea={activeArea} setActiveArea={setActiveArea} />
                </Col>
                <Col sm="8">
                  <Map casesByArea={casesByArea} activeArea={activeArea} setActiveArea={setActiveArea} />
                </Col>
              </Row>
            </Col>
            <Col sm="2">
              <Table casesByArea={casesByArea} activeArea={activeArea} setActiveArea={setActiveArea} />
            </Col>
          </Row>

        </Container>
        : null
    }

  </div>
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
