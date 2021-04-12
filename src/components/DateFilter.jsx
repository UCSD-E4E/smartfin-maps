import React from 'react'
import './componentStyles.css'
import '../styles.css'

/**
 * 
 * @param {function} onSubmit: pass in unix start and end times into here 
 */
export default function DateFilter({ onSubmit, reset }) {

  // NOTE: there should also be functionality to turn off date filter
  // in that case pass in 0 and 0 to onSubmit
  // onSubmit(startDate, endDate)

  function parseInputs(e) {
    e.preventDefault();
    let startDate = document.querySelector("#startDate");
    let endDate = document.querySelector("#endDate");
    startDate = new Date(startDate.value).getTime() / 1000;
    endDate = new Date(endDate.value).getTime() / 1000;

    if (!startDate || ! endDate || endDate - startDate <= 0) {
      alert("start date must be > end date");
      return;
    } else {
      onSubmit(startDate, endDate)
    }
  }

  function handleReset(e) {
    e.preventDefault();
    document.querySelector("#startDate").value = '';
    document.querySelector("#endDate").value = '';
    reset();
  }

  return (
    // keep this id its for styling, but u should edit the styles in componentStyles.css
    <div id="date-filter">
      <p>Filter by Date</p>

      <form id="dateform" action="">
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" name="startDate" id="startDate"/>
        <label htmlFor="startDate">End Date:</label>
        <input type="date" name="endDate" id="endDate"/>
        <button onClick={e => parseInputs(e)}>filter</button>
        <button onClick={e => handleReset(e)}>reset dates</button>
      </form>
    </div>
  )
}
