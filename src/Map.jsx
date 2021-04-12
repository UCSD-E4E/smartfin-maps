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

    let sessions = await fetch("http://ec2-54-203-7-235.us-west-2.compute.amazonaws.com/ride/rides/fields=longitude,latitude,loc1")
    .then(response => response.json())
    .then(data => (data.data));
    sessions = sessions.map(session => (
      {
        position: [session.latitude, session.longitude],
        popup: session.rideId,
        id: session.rideId,
        city: session.loc1,
        date: session.startDate,
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
  fetchSession: async function() {

  }
}

const testData = [
  {
    position: [32, 119],
    id: "Sfin-1a0027001047373333353132-190329-194128",
    city: 'la Jolla',
    date: 1614808649,
  },
  {
    position: [31, 117],
    id: "16072",
    city: 'la Jolla',
    date: 1614808649,
  },
  {
    position: [33, 116],
    id: "16073",
    city: 'la Jolla',
    date: 1614808649,
  },
    {
    position: [34, 115],
    id: "16075",
    city: 'la Jolla',
    date: 1614808649,
  },
  {
    position: [35, 114],
    id: "16076",
    city: 'la Jolla',
    date: 1614808649,
  },
  {
    position: [36, 113],
    id: "16079",
    city: 'la Jolla',
    date: 1614808649,
  },
  {
    position: [37, 110],
    id: "16081",
    city: 'la Jolla',
    date: 1614808649,
  },
  {
    position: [38, 121],
    id: "16088",
    city: 'la Jolla',
    date: 1614808649,
  },
  {
    position: [38, 121],
    id: "16098",
    city: 'la Jolla',
    date: 1614808649,
  },
]



export default function Map() {

  // top level data, this should not change and only update when we get a new session from api
  const [smartfinData, setSmartfinData] = useState([]);

  const [mapView, setMapView] = useState({ center: [32.8, -117.2], zoom: 10 });

  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);

  // this mutable and changes based on filters
  const [listData, setListData] = useState([]);
  const [mapData, setMapData] = useState([]);

  // display chart panel
  const [chartPanelDisplayed, setChartPanelDisplayed] = useState(false);

  // current chart session we are viewing
  const [selectedSession, setSelectedSession] = useState(0);


  useEffect(() => {
    if (startDate === 0 && endDate === 0) {
      API.fetchSessions()
      .then(sessions=> {
        console.log(sessions)
        setSmartfinData(sessions)
      });
    } else {
      // query using start and end date filters
      
    }
  }, []);
  
  useEffect(() => {
    setListData(smartfinData.map(session => 
      ({
        id: session.id,
        date: session.date,
        city: session.city,
        lat: session.position[0],
        lng: session.position[1],
      })
    ));
    setMapData(smartfinData.map(session => 
      ({
        id: session.id,
        position: session.position,
      })
    ));
  }, [smartfinData]);

  useEffect(() => {
    function filterSessions() {
      // filter list data based on start and end date
      // this should actually change map data
      console.log(startDate, endDate)
      if(startDate === 0 && endDate === 0) {
        filterList(0);
        return;
      }

      let updatedData = smartfinData.filter(
        session => (session.date >= startDate && session.date <= endDate)
      );
  
      setSmartfinData(updatedData);
    } 
    filterSessions();
  }, [startDate, endDate]);
  

  function filterList(id) {
    let searchRes = listData.filter(session => (session.id === id));

    if (id === 0) {
      setMapView({ center: [32.8, -117.2], zoom: 1 });
      setListData(smartfinData.map(session => 
        ({
          id: session.id,
          date: session.date,
          city: session.city,
          lat: session.position[0],
          lng: session.position[1],
        })
      ));
      setSelectedSession(0);
      setChartPanelDisplayed(false);
    } 
    else if (searchRes.length === 0) {
      alert("no session matches that id");
    }
    else {
      setListData(searchRes);
    }
  }

  function setDates(startDate, endDate) {
    setStartDate(startDate);
    setEndDate(endDate);
    if (startDate === 0 && endDate === 0) {
      API.fetchSessions()
      .then(sessions=> {
        console.log(sessions)
        setSmartfinData(sessions)
      });
    } else {
      // query using start and end date filters
      
    }
  }

  function onMapMove(topLeftCoordinates, bottomRightCoordinates) {

    let updatedList = smartfinData.map(session => 
      ({
        id: session.id,
        date: session.date,
        city: session.city,
        lat: session.position[0],
        lng: session.position[1],
      })
    )

    // get all sessions between bottom and top latitude
    let topLat = topLeftCoordinates.lat;
    let bottomLat = bottomRightCoordinates.lat;
    updatedList = updatedList.filter(session => ( session.lat < topLat && session.lat > bottomLat ));

    // get all sessions between left and right longitude
    let leftLng = topLeftCoordinates.lng;
    let rightLng = bottomRightCoordinates.lng;
    updatedList = updatedList.filter(session => ( session.lng < leftLng && session.lng > rightLng ));

    setListData(updatedList);
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
          mapData={mapData} 
          onMove={onMapMove}
          mapView={mapView}
          viewChart={setChartPanelDisplayed}/>
      </MapContainer>
      <div id="sidebar">
        <SearchInput sessions={smartfinData} filterList={filterList}/>
        <SessionList 
          sessions={listData} 
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
