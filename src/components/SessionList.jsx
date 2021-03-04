import React, { useState } from 'react';
import { parseIsolatedEntityName } from 'typescript';
import './sidebar.css';

export default function SessionList({ sessions, onItemClick, onViewSession }) {

  const [activeItem, setActiveItem] = useState(0);
  let liClass = "";
  console.log(activeItem)

  function parseDate(unixTime) {
    console.log(unixTime)
    return new Date(unixTime).toString().substr(0, 16);
  }

  function handleItemClick(id, lng, lat) {
    setActiveItem(id);
    onItemClick({ center: [lat, lng], zoom: 15 });
  }

  function parseSessionData(sessions) {
    return sessions.map(session => {
      if (activeItem === session.id) {
        liClass = "active";
      } else {
        liClass = "";
      }
      let date = parseDate(session.date);
      return (
      <li className={ liClass } key={session.id} onClick={() => handleItemClick(session.id, session.lng, session.lat)}>
        <div>
          <p>{ session.city }</p>
          <p>#{ session.id }</p>
        { activeItem === session.id && <button onClick={() => onViewSession(session.id)}>check it out</button> }

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
  
