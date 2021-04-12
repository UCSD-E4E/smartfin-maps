import React, { useState, useEffect } from 'react';
import './chartpanel.css';

const testData = 
  {
    id: "Sfin-1a0027001047373333353132-190329-194128",
    loc1: "La Jolla",
    loc2: "San Diego County",
    loc3: "California",
    startTime: 1553888489,
    endTime: 1553889530,
    heightSmartfin: 0.3270896194714866,
    tempSmartfin: 18.97318719660194,
    buoyCDIP: "201",
    heightCDIP: 1.2599999904632568,
    tempCDIP: 16.57501220703125,
    latitude: 32.866853529702965,
    longitude: -117.25476256930693
}


export default function ChartPanel({ displayed, session, setChartPanelDisplayed }) {

  const [sessionData, setSessionData] = useState({});

  let display = displayed ? "displayed" : "hidden";
  console.log('session: ', session);

  useEffect(() => {
    // API.fetchSessionDetails('Sfin-1a0027001047373333353132-190329-194128')
    // .then(response => console.log(response));
    setSessionData(testData);
  }, []);

  return (
    <div id="chart-panel" className={display}>
      <header>
        <button onClick={() => setChartPanelDisplayed(false)}>x</button>
        {sessionData.id}
      </header>
      <main>
        {sessionData.id}
      </main>
    </div>
  )
}
/*
  function buildChartData(plotpoints) {
    let options = {
      axisX: {
        lineColor: '#CCCCCC',
        valueFormatString: "MMM DD"
      },
      axisY: {
        minimum: 0,
        lineColor: '#CCCCCC',
        gridColor: '#CCCCCC',
        tickColor: '#CCCCCC',
        labelFormatter: function ( e ) {
          return e.value + "m";  
        },
        interval: .1,
      },
      backgroundColor: '#f0f8ff',
      data: [{
        // Change type to "doughnut", "line", "splineArea", etc.
        type: 'line',
        dataPoints: plotpoints.map(data => (
          { 
            x: data.time, 
            y: data.height, 
            rideId: data.rideId, 
            location: data.location 
          }
        )),
        lineColor: '#CCCCCC',
      }],
      dataPointMinWidth: 70,     
      toolTip: {
        content: metric ? "Session #{rideId}, {location} {y}m" : "{y}ft"
      },
      zoomEnabled: true,

    }
    setChartData(options);
  }

  
  return (
    <div>
      <CanvasJSChart options={chartData}/>		
    </div>
  )
  */