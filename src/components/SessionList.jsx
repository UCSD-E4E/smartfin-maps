import React, { useEffect, useState } from 'react';
import './sidebar.css';

export default function SessionList({ 
  sessions, 
  buoys,
  onItemClick, 
  selectedSession, 
  setSelectedSession,
  setChartDisplay,
}) {

  let liClass = "";
  const [listView, setListView] = useState('sessions');

  function parseDate(unixTime) {
    return new Date(unixTime).toString().substr(0, 16);
  }

  function handleItemClick(id, lng, lat) {
    setSelectedSession(id);
    onItemClick({ center: [lat, lng], zoom: 25 });
  }


  function parseSessionData(sessions) {
    return sessions.map(session => {
      // determine if this list item is currently selected
      if (selectedSession === session.id) {
        liClass = "active";
      } else {
        liClass = "";
      }
      let date = parseDate(session.date);
      return (
      <li className={ liClass } key={session.id} onClick={() => handleItemClick(session.id, session.position[1], session.position[0])}>
        <div>
          <p>{ session.city }</p>
          <p>#{ session.id }</p>
        { selectedSession === session.id && <button onClick={() => setChartDisplay(true)}>check it out</button> }

        </div>
        <p>{ date }</p>
      </li>
      ) 
    })
  }

  function parseBuoyData(buoys) {
    return buoys.map(buoy => {
      // determine if this list item is currently selected
      if (selectedSession === buoy.id) {
        liClass = "active";
      } else {
        liClass = "";
      }
      return (
      <li className={ liClass } key={buoy.id} onClick={() => handleItemClick(buoy.id, buoy.position[1], buoy.position[0])}>
        <div>
          <p>Station { buoy.id }</p>
          <p>{ buoy.position }</p>
        </div>
      </li>
      ) 
    })
  }

  function viewBuoys() { setListView('buoys'); }
  function viewFins() { setListView('sessions'); }

  let buoyClass = '';
  let finClass = '';

  if (listView === 'sessions') {
    finClass = 'active';
  } else {
    buoyClass = 'active';
  }

  return (
    <>
      <div id="list-menu">
        <button className={finClass} onClick={ viewFins }>sessions</button>
        <button className={buoyClass} onClick={ viewBuoys }>buoys</button>
      </div>
      
      <ul id="session-list">
        { listView === 'sessions' ?
          sessions && parseSessionData(sessions) 
          :
          buoys && parseBuoyData(buoys)
        } 
      </ul>
    </>
  
  )
}
  
