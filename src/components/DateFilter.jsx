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
      date filter
    </div>
  )
}
