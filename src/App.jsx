import React, { useState } from "react";
import ChartPanel from "./components/ChartPanel";
import Map from "./Map";

import InfoPanel from './components/InfoPanel';



// Top Level window 
export default function App() {

  // const [mapView, setMapView] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const chartPanel = selectedRide ? <ChartPanel/> : '';
  

  return (
    <div>
      { chartPanel }
      <Map/>
    </div>
  );
}
