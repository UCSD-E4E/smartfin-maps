import React, { useState, useEffect, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import requests from 'requests';
import CanvasJSReact from '../assets/canvasjs.react';
import './chartpanel.css';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { faWater, faFlag, faThermometer, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let canvasjs = CanvasJSReact.CanvasJS;
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

// const testData = 
//   {
//     // id: "Sfin-1a0027001047373333353132-190329-194128",
//     loc1: "La Jolla",
//     loc2: "San Diego County",
//     loc3: "California",
//     startTime: 1553888489,
//     endTime: 1553889530,
//     heightSmartfin: 0.3270896194714866,
//     tempSmartfin: 18.97318719660194,
//     buoyCDIP: "201",
//     heightCDIP: 1.2599999904632568,
//     tempCDIP: 16.57501220703125,
//     latitude: 32.866853529702965,
//     longitude: -117.25476256930693
// }

const getRide = async (rideId) => {
  return new Promise((resolve, reject) => {
    console.log('FETCHING', rideId)
    axios
      .get(`https://ride-api.online/ride/rides/rideId=${rideId}?format=json`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getAcc = async (rideId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://ride-api.online/ride/rides/rideId=${rideId}/datalist/type=acc`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getTemp = async (rideId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://ride-api.online/ride/rides/rideId=${rideId}/datalist/type=temp`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const downloadCSV = async (rideId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://ride-api.online/ride/rides/rideId=${rideId}/dataframes/type=motion`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};




export default function ChartPanel({ displayed, session, setChartPanelDisplayed }) {
  const [ride, setRide] = useState({"heightSmartfin":0, "tempSmartfin":0});
  const [acc, setAcc] = useState({"acc":[]});
  const [temp, setTemp] = useState({"temp": []})
  // const [sessionData, setSessionData] = useState({});
  const [heightOptions, setHeightOptions] = useState({});
  const [accOptions, setAccOptions] = useState({});
  const [tempOptions, setTempOptions] = useState({});
  const [tempColor, setTempColor] = useState([]);

  const heightref = useRef(null);
  const [heightheight, sethh] = useState(200);
  const accref = useRef(null);
  const [accheight, setah] = useState(200);
  const tempref = useRef(null);
  const [tempheight, setth] = useState(200);


  useEffect(() => {
    if (session) {
      getRide(session).then((res) => {
        setRide(res.data);
      })
      .catch((res) => 
        setRide(false)
      );
  
      getAcc(session).then((res) => {
        setAcc(res.data);
      })
      .catch((res) => 
        setAcc(false)
      );
  
      getTemp(session).then((res) => {
        setTemp(res.data);
      }).catch((res) => {
        setTemp(false);
      })
      
      sethh(heightref.current.clientHeight);
      setah(accref.current.clientHeight);
      setth(tempref.current.clientHeight);
    }
  }, [session]);

  useEffect(()=>{
    let heightSmartfin = ride.heightSmartfin ? ride.heightSmartfin : 0;
    let heightCDIP = ride.heightCDIP ? ride.heightCDIP : 0;

    let color = 0;
    color = 255 * ((ride.tempSmartfin  - 32)/62)
    if(color < 0){
      color = 0;
    }else if (color > 255){
      color = 255;
    }
    setTempColor(color);

    // height oiptions
    const options = {
      height: heightheight,
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", //"light1", "dark1", "dark2"
			title:{
				text: "Smartfin vs CDIP Heights"
			},
			axisY: {
				includeZero: true,
        title: "height (m)",
			},
			data: [{
				type: "bar", //change type to bar, line, area, pie, etc
				//indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#5A5757",
				indexLabelPlacement: "outside",
				dataPoints: [
					{ y: heightSmartfin, label: "Smartfin Height (m)" },
					{ y: heightCDIP, label: "Buoy Height (m)" }
				]
			}]
		}
    setHeightOptions(options);
  }, [ride]);

  useEffect(()=>{
    let counter = 0;
    let dataPoints = acc.acc ? 
    acc.acc.map( (num) => {
      ++counter;
      return { x:counter, y:num}
    }) 
    :
    [];
    const options = {
      height: accheight,
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "Vertical Acceleration vs Time"
			},
			axisY: {
				title: "Acceleration (m/s^2)",
			},
			axisX: {
				title: "Time  (s)",
				interval: 100
			},
			data: [{
				type: "line",
				toolTipContent: "{x}s into session {y}m/s^2",
				dataPoints: dataPoints 
			}]
		}
    setAccOptions(options);
  }, [acc]);

  //temp options
  useEffect(()=>{
    let counter = 0;
    let dataPoints = temp.temp ?
    temp.temp.map( (num) => {
      ++counter;
      return { x:counter, y:num}
    }) 
    :
    [];
    const options = {
      height: tempheight,
			animationEnabled: true,
      exportEnabled: true,
			theme: "light2", //"light1", "dark1", "dark2"
			title:{
				text: "Temperature vs Time"
			},
			axisX: {
        title: "Time Elapsed (s)",
				interval: 100
			},
			axisY: {
				title: "Temperature (C)",
			},
			data: [{
				type: "spline",
        toolTipContent: "{x}s into session {y} C",
				dataPoints: dataPoints
      }]
		}
    setTempOptions(options);
  },[temp])

  function handleDownload(e) {
    e.preventDefault();
    if (acc.acc) {
      downloadCSV(session).then(res => {
        console.log(res.data)
        var encodedUri = 'data:text/csv;charset=utf-8,'+encodeURI(res.data);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${session}.csv`);
        document.body.appendChild(link); // Required for FF
        
        link.click(); // This will download the data file named "my_data.csv".
      });  
    } else {
      alert('there is no .csv file available for this session');
    }
  }

  let displayClass = displayed ? "displayed" : "hidden";

  return (
    <div id="chart-panel-wrapper" className={displayClass}>
    <div id="chart-panel" className={displayClass}>
      <div id="header">
        <button id="exit" onClick={() => setChartPanelDisplayed(false)}>x</button>
        <div id="title">
          <h3>
            {ride.rideId}
          </h3>
          <h4>
            @ {ride.loc1}
          </h4>
        </div>
        {
          acc.acc ? 
          <button id="download" onClick={handleDownload}>download .csv</button>
          :
          null
        }
      </div>

     
      
      <div id="stats">
        <div>
          <FontAwesomeIcon icon={faWater} />
          <p>Avg Session Height</p>
          <h2>
            {ride.heightSmartfin && ride.heightSmartfin.toLocaleString(
                undefined,
                {maximumFractionDigits: 3}
              )
            } m
          </h2>
        </div>
        <div>
          <FontAwesomeIcon icon={faFlag} />
          <p>Nearest CDIP statipm</p>
          <h2>
            {ride.buoyCDIP}
            <br/>
            <span style={{fontSize:"small"}}>view station</span>
          </h2> 
        </div>
        <div>
          <FontAwesomeIcon icon={faThermometer} />
          <p>Avg Session Temperature</p>
          <h2 style={{color:`rgb(${tempColor},0,0)`}}>
            {ride.tempSmartfin && ride.tempSmartfin.toLocaleString(
                undefined,
                {maximumFractionDigits: 3}
              )
            } C
          </h2> 
        </div>
        <div>
          <FontAwesomeIcon icon={faClock} />
          <p>Session Duration</p>
          <h2>
            {
              (() => { 
                const time1 = new Date(ride.startTime);
                const time2 = new Date(ride.endTime);
                let diff = Math.abs(time2-time1);
                let minutes = Math.floor(diff / 60);
                return minutes;
              })() 
            } minutes
          </h2>
        </div>
      </div>
      <div id="heightchart" ref={heightref} class="chart">
        <CanvasJSChart options = {heightOptions} />
      </div>
      <div id="acctime" ref={accref} class="chart">
        { accOptions ?  <CanvasJSChart options={accOptions}/> : <p>no acceleration data availiable for this session</p> }
      
      </div>
      <div id="temptime" ref={tempref} class="chart">
        { temp.temp ? <CanvasJSChart options = {tempOptions}/> : <p>no temperature data availiable for this session</p> }
        
        
      </div>
    </div>
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