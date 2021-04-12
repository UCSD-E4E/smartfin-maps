import React, { useState, useEffect } from "react";
import ChartPanel from "./components/ChartPanel";
import Map from "./Map";

import InfoPanel from './components/InfoPanel';



// Top Level window 
export default function App() {
  const defaultId = "Sfin-1a0027001047373333353132-190329-194128";
  // const [mapView, setMapView] = useState(true);
  const [selectedSession, setSelectedSession] = useState(defaultId);

  // useEffect(() => {
  //   setSelectedSession(defaultId) 
  // }, [])
  

  return (
    <div>
      <Map/>
    </div>
  );
}
