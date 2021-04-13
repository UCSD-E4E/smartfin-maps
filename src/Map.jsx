import React, { useEffect, useState, useRef } from 'react'
import { MapContainer } from "react-leaflet";
import DateFilter from './components/DateFilter';
import SessionList from './components/SessionList';
import SearchInput from './components/SearchInput';
import "./styles.css";
import SmartfinMap from './components/SmartfinMap';
import { map } from 'leaflet';
import ChartPanel from './components/ChartPanel';



const API = {
  fetchSessions: async function() {
    console.log('sessions: ');

    let sessions = await fetch("http://ec2-54-203-7-235.us-west-2.compute.amazonaws.com/ride/rides/fields=longitude,latitude,loc1,startTime")
    .then(response => response.json())
    .then(data => (data.data));
    sessions = sessions.map(session => (
      {
        type: 'session',
        id: session.rideId,
        city: session.loc1,
        date: session.startDate,
        position: [session.latitude, session.longitude]
      }
    ));
    localStorage.setItem('sessions', JSON.stringify(sessions));
    return sessions;
  },
  fetchBuoys: async function() {
    let buoys = await fetch("http://ec2-54-203-7-235.us-west-2.compute.amazonaws.com/ride/buoys/fields")
    .then(response => response.json())
    .then(data => {
      console.log('BUOY DATA', data)
      return data.map(buoy => {
        return {
          type: 'buoy',
          position: [buoy.latitude, buoy.longitude],
          id: buoy.buoyNum,
        }
      });
    })
    .catch(error => console.log(error));
    localStorage.setItem('buoys', JSON.stringify(buoys));
    return buoys;
  },
}


export default function Map() {

  // top level data, this should not change and only update when we get a new session from api
  const [sessions, setSessions] = useState([]);
  const [buoys, setBuoys] = useState([]);

  const [mapView, setMapView] = useState({ center: [32.8, -117.2], zoom: 10 });

  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);

  // display chart panel
  const [chartPanelDisplayed, setChartPanelDisplayed] = useState(false);

  // current chart session we are viewing
  const [selectedSession, setSelectedSession] = useState(0);


  useEffect(() => {
    async function fetchData() {
      let sessions = localStorage.getItem('sessions');
  
      if (sessions) {
        sessions = JSON.parse(sessions);
      } else {
        sessions = await API.fetchSessions();
      }
      setSessions(sessions);

      let buoys = localStorage.getItem('buoys');
  
      if (buoys) {
        buoys = JSON.parse(buoys);
      } else {
        buoys = await API.fetchBuoys();
      }
      setBuoys(buoys);
    }
    fetchData()
  }, []);

  useEffect(() => {
    async function filterSessions() {
      if (!sessions) return;
      // filter list data based on start and end date
      // this should actually change map data
      if(startDate === 0 && endDate === 0) {
        filterList(0);
        return;
      }

      let newSessions = JSON.parse(localStorage.getItem('sessions'));
      if (!newSessions) return;
     
      if (!startDate && !endDate) {
        newSessions = newSessions.filter(
          session => (session.date >= startDate && session.date <= endDate)
        );
      }
      setSessions(newSessions);
    } 
    filterSessions();
  }, [startDate, endDate]);
  

  function filterList(id) {
    if (!sessions) {
      return;
    }
    let newSessions = JSON.parse(localStorage.getItem('sessions'));
    if (!newSessions) return;
    let searchRes = newSessions.filter(session => (session.id === id));

    if (id === 0) {
      setMapView({ center: [32.8, -117.2], zoom: 1 });
      setSessions(newSessions);
      setSelectedSession(0);
      setChartPanelDisplayed(false);
    } 
    else if (searchRes.length === 0) {
      alert("no session matches that id");
    }
    else {
      setSessions(searchRes);
    }
  }

  function setDates(startDate, endDate) {
    setStartDate(startDate);
    setEndDate(endDate);
  }

  function onMapMove(topLeftCoordinates, bottomRightCoordinates) {
    let updatedList = JSON.parse(localStorage.getItem('sessions'));
    if (!updatedList) return;
    // get all sessions between bottom and top latitude
    let topLat = topLeftCoordinates.lat;
    let bottomLat = bottomRightCoordinates.lat;
    updatedList = updatedList.filter(session => ( session.position[0] < topLat && session.position[0] > bottomLat ));

    // get all sessions between left and right longitude
    let leftLng = topLeftCoordinates.lng;
    let rightLng = bottomRightCoordinates.lng;
    updatedList = updatedList.filter(session => ( session.position[1] < leftLng && session.position[1] > rightLng ));

    setSessions(updatedList);
  }

  // TODO: ADD IN HOVER FUNCTIONALITY TO PULL UP SESSION INFO PANELS


  return (
    <div id="map-container">
      <MapContainer
        className="markercluster-map"
        center={mapView[0]}
        zoom={4}
        worldCopyJump={true}
      >
        <SmartfinMap 
          sessions={sessions} 
          buoys={buoys}
          onMove={onMapMove}
          mapView={mapView}
          viewChart={setChartPanelDisplayed}/>
      </MapContainer>
      <div id="sidebar">
        <SearchInput 
          sessions={sessions} 
          filterList={filterList}/>
        <SessionList 
          sessions={sessions} 
          buoys={buoys}
          onItemClick={setMapView} 
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          setChartDisplay={setChartPanelDisplayed}
        />
      </div>
      <DateFilter onSubmit={setDates}/>
      <ChartPanel 
        displayed={chartPanelDisplayed} 
        setChartPanelDisplayed={setChartPanelDisplayed}
        session={selectedSession}
      />
    </div>
    
  )
}
