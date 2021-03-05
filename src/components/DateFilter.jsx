import React from 'react'
import './componentStyles.css'
import '../styles.css'

/**
 * 
 * @param {function} onSubmit: pass in unix start and end times into here 
 */
export default function DateFilter({ onSubmit }) {

  // NOTE: there should also be functionality to turn off date filter
  // in that case pass in 0 and 0 to onSubmit
  // onSubmit(startDate, endDate)

  return (
    // keep this id its for styling, but u should edit the styles in componentStyles.css
    <div id="date-filter">
      <p>Filter by Date</p>

      <form id="dateform" action="">
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" name="startDate" id="startDate"/>
        <label htmlFor="startDate">End Date:</label>
        <input type="date" name="endDate" id="endDate"/>

      </form>
    </div>
  )
}
