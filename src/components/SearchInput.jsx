import React from 'react';
import './sidebar.css';

export default function SearchInput({ sessions, filterList }) {

  function selectSession(e) {
    e.preventDefault();
    filterList(document.getElementById('id-input').value);
  }


  return (
    <div id="search-wrapper">
      <img src={require('../assets/logo.jpg')} alt="smartfin maps"/>
      <form>
        <label htmlFor="id-input">Find a session:</label>
        <input id="id-input" placeholder="session id" list="ids" type="text"/>

        <datalist id="ids">
          { sessions.map(session => (
            <option key={session.id} value={session.id}/>
          )) }
        </datalist>
        <button onClick={ selectSession }>go!</button>
        <button onClick={ (e)=> { e.preventDefault(); filterList(0) }}>reset</button>
      </form>
    </div>
  )
}
