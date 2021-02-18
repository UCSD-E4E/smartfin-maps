import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, Circle, TileLayer, Marker, useMapEvent, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import SessionList from './SessionList';
import "./styles.css";


const API = {
  fetchSessions: async function() {
    let sessions = await fetch("http://ec2-54-203-7-235.us-west-2.compute.amazonaws.com/ride/rides/fields=longitude,latitude")
    .then(response => response.json())
    .then(data => (data.data));
    sessions = sessions.map(session => (
      {
        position: [session.latitude, session.longitude],
        popup: session.rideId,
        id: session.rideId,
      }
    ));
    return sessions;
  },
  fetchBuoys: async function() {
    let response;
    fetch("http://ec2-54-203-7-235.us-west-2.compute.amazonaws.com/ride/rides/fields=longitude,latitude")
    .then(response => response.json())
    .then(data => {
      return data.data.map(session => (
        {
          position: [session.latitude, session.longitude],
          popup: session.rideId,
          id: session.rideId,
        }
      ));
    })
    .catch(error => console.log(error));
    return response;
  },
}



export default function Map() {

  const [smartfinData, setSmartfinData] = useState([]);
  
  useEffect(() => {
    API.fetchSessions()
    .then(sessions=> setSmartfinData(sessions));
    // ))
    //   .then(sessions => {
    //     console.log(sessions)
    //     setSmartfinData(sessions)
    //   });
  }, [])

  const data = [
    {
      position: [49.8397, 24.0297],
      popup: <div>position</div>
    },
    {
      position: [48.8397, 25.0297],
      popup: <div>position</div>
    },
    {
      position: [47.8397, 23.0297],
      popup: <div>suck dik</div>
    },
    {
      position: [7.8397, 123.0297],
      popup: <div>suck dik</div>
    },
  ]

  return (
    <div>
      <MapContainer
        className="markercluster-map"
        center={[0,0]}
        zoom={4}
        worldCopyJump={true}
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hcnRmaW4tbWFwcyIsImEiOiJja2w0cG45Mm4wcWJvMm5wZWRtd3dsbG5jIn0.5W4X8d9QNECWLq2tMQp49w"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup zoomToBoundsOnClick={true}>
          {smartfinData && smartfinData.map(session => (
            <Circle key={session.id} center={session.position} radius={50} color="green">
              <Popup key={session.id}>
                <div>{session.popup}</div>
              </Popup>
            </Circle>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
    
  )
}
