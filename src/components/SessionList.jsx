import React, { useEffect, useState } from 'react';
import './sidebar.css';

export default function SessionList({ 
  sessions, 
  onItemClick, 
  selectedSession, 
  setSelectedSession,
  setChartDisplay,
}) {

  let liClass = "";

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

  return (
    <ul id="session-list"> 
      { sessions && parseSessionData(sessions) }
    </ul>
  )
}
  
