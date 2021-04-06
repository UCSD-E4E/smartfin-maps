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
    axios
      .get(`http://ec2-54-203-7-235.us-west-2.compute.amazonaws.com/ride/rides/rideId=${rideId}?format=json`)
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
      .get(`http://ec2-54-203-7-235.us-west-2.compute.amazonaws.com/ride/rides/rideId=${rideId}/datalist/type=acc`)
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
      .get(`http://ec2-54-203-7-235.us-west-2.compute.amazonaws.com/ride/rides/rideId=${rideId}/datalist/type=temp`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};




export default function ChartPanel({ displayed, sessionId }) {
  console.log(sessionId);
  const [id, setid] = useState(sessionId);
  const [ride, setRide] = useState({"heightSmartfin":0, "tempSmartfin":0});
  const [acc, setAcc] = useState({"acc":[]});
  const [temp, setTemp] = useState({"temp": []})
  // const [sessionData, setSessionData] = useState({});
  const [toDisplay, setToDisplay] = useState({displayed})
  const [displayClass, setDisplayClass] = useState("hidden");
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
    // API.fetchSessionDetails('Sfin-1a0027001047373333353132-190329-194128')
    // .then(response => console.log(response));
    // setSessionData(testData);

    getRide(id).then((res) => {
      setRide(res.data);
    });

    // getAcc(id).then((res) => {
    //   setAcc(res.data);
    // });

    // getTemp(id).then((res) => {
    //   setTemp(res.data);
    // })
    
    sethh(heightref.current.clientHeight);
    setah(accref.current.clientHeight);
    setth(tempref.current.clientHeight);
  }, []);

  useEffect(()=>{
    console.log("Ride: ", ride);

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
        title: "height (ft)",
			},
			data: [{
				type: "bar", //change type to bar, line, area, pie, etc
				//indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#5A5757",
				indexLabelPlacement: "outside",
				dataPoints: [
					{ y: ride.heightSmartfin, label: "Smartfin Height" },
					{ y: ride.heightCDIP, label: "Buoy Height" }
				]
			}]
		}
    setHeightOptions(options);
  }, [ride]);

  useEffect(()=>{
    console.log(acc.acc);
    let counter = 0;
    const options = {
      height: accheight,
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "Acc vs Time"
			},
			axisY: {
				title: "Acceleration",
			},
			axisX: {
				title: "Time",
				interval: 100
			},
			data: [{
				type: "line",
				toolTipContent: "Week {x}: {y}%",
				dataPoints: 
          acc.acc.map( (num) => {
            ++counter;
            return { x:counter, y:num}
          }) 
			}]
		}

    setAccOptions(options);
  }, [acc]);

  //temp options
  useEffect(()=>{
    let counter = 0;
    const options = {
      height: tempheight,
			animationEnabled: true,
      exportEnabled: true,
			theme: "light2", //"light1", "dark1", "dark2"
			title:{
				text: "Temp vs Time"
			},
			axisX: {
        title: "Time",
				interval: 100
			},
			axisY: {
				title: "Temp",
			},
			data: [{
				type: "spline",
				dataPoints: 
          temp.temp.map( (num) => {
            ++counter;
            return { x:counter, y:num}
          }) 
      }]
		}
    setTempOptions(options);
  },[temp])

  useEffect(()=>{
    let display = displayed ? "displayed" : "hidden";
    setDisplayClass(display);
  },[toDisplay])

  return (
    <div id="chart-panel" className={displayClass}>
      <div id="header">
        <button id="exit" onClick={() => setDisplayClass("hidden")}>x</button>
        <h3>
          {ride.rideId}
          <hr/>
          @ {ride.loc1}
        </h3>
      </div>

      <div id="download-area">
        <button id="download">download .csv</button>
      </div>
      
      <div id="stats">
        <div>
          <FontAwesomeIcon icon={faWater} />
          <p>Session Height</p>
          <h2>
            {ride.heightSmartfin.toLocaleString(
                undefined,
                {maximumFractionDigits: 3}
              )
            } ft
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
          <p>Session Temperature</p>
          <h2 style={{color:`rgb(${tempColor},0,0)`}}>
            {ride.tempSmartfin.toLocaleString(
                undefined,
                {maximumFractionDigits: 3}
              )
            } F
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
        <CanvasJSChart options = {heightOptions} 
          /* onRef={ref => this.chart = ref} */
        />
      </div>
      <div id="acctime" ref={accref} class="chart">
        <CanvasJSChart options = {accOptions}
          /* onRef={ref => this.chart = ref} */
        />
      </div>
      <div id="temptime" ref={tempref} class="chart">
        <CanvasJSChart options = {tempOptions}
          /* onRef={ref => this.chart = ref} */
        />
      </div>
    </div>
  )
}
