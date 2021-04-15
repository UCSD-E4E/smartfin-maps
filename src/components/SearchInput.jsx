import React from 'react';
import './sidebar.css';

export default function SearchInput({ sessions, filterList, setListView }) {

  function selectSession(e) {
    e.preventDefault();
    filterList(document.getElementById('id-input').value);
  }

  function reset(e) {
    e.preventDefault(); 
    filterList(0);
    document.getElementById('id-input').value = '';
  }

  function viewBuoys(e) {
    e.preventDefault();
    setListView('buoys');
  }

  function viewFins(e) {
    e.preventDefault();
    setListView('sessions');
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
        <button onClick={ reset }>reset</button>
        
      </form>
    </div>
  )
}
