import React, { useEffect } from 'react';
import '../styles.css';
import { MapContainer, Circle, TileLayer, Marker, useMapEvent, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import InfoPanel from './InfoPanel';


export default function SmartfinMap({ 
  sessions, 
  buoys, 
  onMove, 
  mapView, 
  viewChart 
}) {

  const { center, zoom } = mapView;
  const map = useMapEvent('mouseup', () => {
    console.log('mouseup')
    const { _northEast, _southWest } = map.getBounds();
    onMove(_northEast, _southWest);
  });
  useMapEvent('zoom', () => {
    console.log('mouseup')
    const { _northEast, _southWest } = map.getBounds();
    onMove(_northEast, _southWest);
  });

  useEffect(() => {
    console.log("setting center and zoom");
    map.setView(center, zoom);
  }, [center, zoom]);

  if (sessions && buoys) {

    return (
      <div>
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hcnRmaW4tbWFwcyIsImEiOiJja2w0cG45Mm4wcWJvMm5wZWRtd3dsbG5jIn0.5W4X8d9QNECWLq2tMQp49w"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup zoomToBoundsOnClick={true}>
        {
              sessions && sessions.map(session => (
              <Circle 
                key={session.id} 
                center={session.position} 
                radius={15} 
              >
                <Popup key={session.id}>
                  <InfoPanel 
                    type={session.type}
                    viewChart={viewChart}
                    id={session.id}></InfoPanel>
                </Popup>
              </Circle>
              ))
            }
           
            </MarkerClusterGroup>
        <MarkerClusterGroup zoomToBoundsOnClick={true}>
         {
              buoys && buoys.map(buoy => (
              <Circle 
                key={buoy.id} 
                center={buoy.position} 
                radius={15} 
                color="purple"
              >
                <Popup key={buoy.id}>
                  <InfoPanel 
                    type={buoy.type}
                    viewChart={viewChart}
                    buoy={buoy}></InfoPanel>
                </Popup>
              </Circle>
              ))
            }
        </MarkerClusterGroup>
        
      </div>
    )
  } else {
    return null;
  }

}
