import React, { useEffect, useState } from 'react';
// import axios, { AxiosResponse } from 'axios';
// import requests from 'requests';
import './componentStyles.css';
import '../styles.css';

const dummy = {"rideId":"15693","loc1":"La Jolla","loc2":"San Diego","loc3":"San Diego County","startTime":1541791072,"endTime":1541794669,"heightSmartfin":0.45671978326367835,"tempSmartfin":20.044069023569023,"buoyCDIP":"201","heightCDIP":0.4414551854133606,"tempCDIP":19.860002517700195,"latitude":32.86058653508772,"longitude":-117.25365867324561}

const getRide = async (rideId) => {
  return new Promise((resolve, reject) => {
    fetch(`http://ec2-54-203-7-235.us-west-2.compute.amazonaws.com/ride/rides/rideId=${rideId}`)
      .then((res) => {
        return res.json();
      })
      .then(data => {
        resolve(data)
      })
      .catch((error) => {
        console.log('Ranks Failed');
        reject(error);
      });
  });
};

/**
 * 
 * @param {string} session: session data to display in this component
 * @param {function} onClick: pass the id into here when this panel is clicked
 */
export default function InfoPanel({ sessionId, viewChart }) {

  // TODO: query the api using the sessionId to get the details and then display it
  const [ride, setRide] = useState(dummy);

  useEffect(() => {
    getRide(sessionId).then((res) => {
      setRide(res)
    });
    // setRide(dummy);
  }, [])

  // useEffect(() => {
  //   console.log("RIDE", ride);
  // }, [ride])

  if (ride.heightSmartfin) {
    
    return (
      <div id="panel">
        <div id="banner">
          <p>{ sessionId } <br/></p>
        
        </div>

        <p>sfin height:</p>
        <p>{
          ride.heightSmartfin.toLocaleString(
            undefined,
            {maximumFractionDigits: 3}
          )}m</p>
        
        <p>location:</p>
        <p>{ride.loc2}</p>

        <p>longitude:</p>
        <p>{
          ride.longitude.toLocaleString(
            undefined,
            {maximumFractionDigits: 3}
          )
          }</p>

        <p>latitude:</p>
        <p>{
          ride.latitude.toLocaleString(
            undefined,
            {maximumFractionDigits: 3}
          )
          }</p>

        <p>date:</p>
        <p>{
          (() => { 
            const time = new Date(ride.startTime * 1000);
            return time.getMonth() + "/" + time.getDate() + "/" + time.getFullYear();
          })()
        }</p>

        <p>duration:</p>
        <p>{
          (() => { 
            const time1 = new Date(ride.startTime);
            const time2 = new Date(ride.endTime);
            let diff = Math.abs(time2-time1);
            let minutes = Math.floor(diff / 60);
            return minutes;
          })() 
        } min</p>

        <p>CDIP Station:</p>
        <p>{ride.buoyCDIP}</p>
        <p></p>
        <p id="see-details" onClick={viewChart}>see details</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>loading</p>
      </div>
    )
  }
}
