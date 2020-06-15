import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { csv } from "d3"

import "./App.css";

import Table from "./components/Table/Table";
import Pie from "./components/Pie/Pie";
import Map from "./components/Map/Map";
import Chart from "./components/Chart/Chart";


import { Container, Row, Col } from 'reactstrap';

const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Oct", "Nov", "Dec"]

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

      setSelectedMinDate(dates.length - 31)
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
      setPopulations(populations.map(item => {
        return {
          ...item,
          population: parseInt(item.population)
        }
      }))
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

      const chartData = dates.map((date, index) => {
        let cases = data.filter(item => item.date === date).reduce((a, b) => a + b[metric], 0);

        if (adjustToPopulation && populations) {
          const totalPopulation = populations.reduce((a, b) => a + b.population, 0);
          console.log(totalPopulation)
          cases = (cases / totalPopulation) * 10000
        }

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
          item.keyDateYLocation = 0
          item.keyDateInfo = keyDate;
        }

        return item
      })

      setChartData(chartData)

      const areas = [...new Set(currentData.map(item => item.areaName))];
      let casesByArea = {};

      areas.forEach(area => {
        casesByArea[area] = currentData.filter(item => item.areaName === area).reduce((a, b) => a + b[metric], 0);
      });

      setCasesByArea(casesByArea)

      const maxValue = Math.max(...Object.values(casesByArea))

    }
  }, [data, keyDates, selectedMinDate, selectedMaxDate, dates, adjustToPopulation, populations, metric]);

  return <div className="App">
    {
      currentData ?
        <Container>
          <Row>
            <Col>
              <div className="title">COVID-19 in London</div>
            </Col>
          </Row>
          <Row>
            <Col sm="9">
              <Row>
                <Col sm="4">
                  <div className="section">
                    <div className="section__heading">METRIC</div>
                    <button className={metric === "newCases" ? "controls__button controls__button--active" : "controls__button"}
                      onClick={() => {
                        setMetric("newCases");
                        setSelectedMinDate(dates.length - 31);
                        setSelectedMaxDate(dates.length - 1)
                      }}>New Cases</button>
                    <button className={metric === "totalCases" ? "controls__button controls__button--active" : "controls__button"}
                      onClick={() => {
                        setMetric("totalCases");
                        setSelectedMinDate(dates.length - 1);
                        setSelectedMaxDate(dates.length - 1)
                      }}>Total Cases</button>
                  </div>
                </Col>
                <Col sm="4">
                  <div className="section">
                    <div className="section__heading">POPULATION NORMALISATION</div>
                    <button
                      className={!adjustToPopulation ? "controls__button controls__button--active" : "controls__button"}
                      onClick={() => {
                        setAdjustToPopulation(false)
                      }}>Unormalised</button>
                    <button
                      className={adjustToPopulation ? "controls__button controls__button--active" : "controls__button"}
                      onClick={() => {
                        setAdjustToPopulation(true)
                      }}>Normalised (per 10k ppl) </button>
                  </div>
                </Col>
                <Col sm="4">
                  {metric !== "totalCases" ?
                    <div className="section">
                      <div className="section__heading">DATE RANGE</div>
                      <div className="controls__button controls__button--active">
                        {new Date(dates[selectedMinDate]).getDate() + " " + months[new Date(dates[selectedMinDate]).getMonth()]} - {new Date(dates[selectedMaxDate]).getDate() + " " + months[new Date(dates[selectedMaxDate]).getMonth()]}
                      </div>
                      <div className="controls__tip">
                        (Select date range from graph below)
                    </div>
                    </div>
                    :
                    <div className="section">
                      <div className="section__heading">DATE</div>
                      <div className="controls__button controls__button--active">
                        {new Date(dates[selectedMinDate]).getDate() + " " + months[new Date(dates[selectedMinDate]).getMonth()]}
                      </div>
                      <div className="controls__tip">
                        (Select date from graph below)
                    </div>
                    </div>
                  }
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="section">
                    <div className="section__heading">DAILY CASES - ALL BOROUGHS
                </div>
                    <Chart chartData={chartData} dates={dates} selectedMinDate={selectedMinDate} selectedMaxDate={selectedMaxDate} setSelectedMinDate={setSelectedMinDate} setSelectedMaxDate={setSelectedMaxDate} keyDates={keyDates} metric={metric} allowRange={metric !== "totalCases"} />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm="4">
                  <div className="section">
                    <div className="section__heading">PROPORTION BY BOROUGH</div>
                    <Pie casesByArea={casesByArea} activeArea={activeArea} setActiveArea={setActiveArea} />
                  </div>
                </Col>
                <Col sm="8">
                  <div className="section">
                    <div className="section__heading">GEOGRAPHIC DISTRIBUTION</div>
                    <Map casesByArea={casesByArea} activeArea={activeArea} setActiveArea={setActiveArea} />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col sm="3">
              <div className="section">
                <div className="section__heading">CASES BY BOROUGH
            </div>
                <Table casesByArea={casesByArea} activeArea={activeArea} setActiveArea={setActiveArea} />
              </div>
            </Col>
          </Row>

        </Container>
        : null
    }

  </div >
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
