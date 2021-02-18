import React from 'react';
import './componentStyles.css';
import '../styles.css';

/**
 * 
 * @param {string} session: session data to display in this component
 * @param {function} onClick: pass the id into here when this panel is clicked
 */
export default function InfoPanel({ sessionId, onClick }) {

  // TODO: query the api using the sessionId to get the details and then display it

  return (
    <div>
      { sessionId }
    </div>
  )
}
