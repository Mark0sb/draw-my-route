/* global google */
import React, { useState, useEffect, useLayoutEffect } from "react";
import { observer } from 'mobx-react-lite';
import { StoreProvider, useStore } from '../../services/store';
import { DirectionsRenderer, GoogleMap, withGoogleMap } from "react-google-maps";

import './home.scss'

const Home = observer(() => {
  const store = useStore();

  const travelMode = window.google.maps.TravelMode.DRIVING

  useEffect(() => {

    if (store.origin && store.destination) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: store.origin,
          destination: store.destination,
          travelMode: travelMode,
          // waypoints: waypoints
        },
        (result, status) => {
          console.log(result)
          if (status === google.maps.DirectionsStatus.OK) {
            store.directions = result;
          } else {
            store.error = result;
          }
        }
      );
    }

  }, [store.origin, store.destination]);

  useLayoutEffect(() => {
    const position = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          position => {
            console.log('lat: ', position.coords.latitude)
            console.log('lng: ', position.coords.longitude)
            store.currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude }
            store.origin = { lat: position.coords.latitude, lng: position.coords.longitude }
          },
          err => console.log('err: ', err))
      } catch (error) {

      }
    }
    position()
  }, [])

  const GoogleMapExample = withGoogleMap(props => (
    <GoogleMap
      defaultCenter={store.origin}
      defaultZoom={13}
    >
      {props.children}
    </GoogleMap>
  ));

  const handleSetOrigin = (event) => {
    console.log('e: ', event.target.value)
    if (event.target.value === 'CURRENT_POSITION') {
      store.origin = store.currentPosition
    } else if (event.target.value === 'ENTRANCE') {
      store.origin = store.entrance
    }
  }

  const handleSetDestination = (event) => {
    store.destination = store.places['Los Tilos'][event.target.value]
  }

  return (
    <div className="home-container">
      <div className="options-container">
        <select onChange={handleSetOrigin}>
          <option disabled selected>Elige el origen</option>
          <option value={'CURRENT_POSITION'} className='option'>Tu ubicación Actual</option>
          <option value={'ENTRANCE'} className='option'>La entrada del Barrio</option>
        </select>
        <select onChange={handleSetDestination}>
          <option disabled selected>Elige el destino</option>
          {
            Object.entries(store.places['Los Tilos']).map(([key, value]) =>
              <option value={key} className='option'>Los Tilos {key}</option>
            )
          }
        </select>
      </div>
      <GoogleMapExample
        containerElement={<div className="map-container" />}
        mapElement={<div style={{ height: `100%` }} />}
      >
        {
          store.directions &&
          <DirectionsRenderer directions={store.directions} />
        }
      </GoogleMapExample>
    </div >
  )
});

export default Home;