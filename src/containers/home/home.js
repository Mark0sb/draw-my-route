/* global google */
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../services/store';
import { DirectionsRenderer, GoogleMap, withGoogleMap } from "react-google-maps";

import './home.scss'

const Home = observer(() => {
  const store = useStore();

  const travelMode = window.google.maps.TravelMode.DRIVING

  const houseRef = useRef(null)

  useEffect(() => {

    if (store.origin && store.destination) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: store.origin,
          destination: store.destination,
          travelMode: travelMode,
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

  useEffect(() => {
    if(store.origin && store.neighborhood && store.house) {
      store.destination = store.places.Barrios[store.neighborhood][store.house]
    }
  }, [store.orign, store.neighborhood, store.house])

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

  const handleSetNeighborhood = (event) => {
    store.directions = null
    store.neighborhood = event.target.value
    store.house = null
    houseRef.current.selectedIndex = "0"
  }

  const handleSetDestination = (event) => {
    store.house = event.target.value
  }

  return (
    <div className="home-container">
      <div className="options-container">
        <h1>Origen</h1>
        <select onChange={handleSetOrigin}>
          <option disabled selected>Elige el origen</option>
          <option value={'CURRENT_POSITION'} className='option'>Tu ubicación Actual</option>
          <option value={'ENTRANCE'} className='option'>La entrada del Barrio</option>
        </select>
        <h1>Destino</h1>
        <select onChange={handleSetNeighborhood}>
          <option disabled selected>Elige el Barrio</option>
          {
            Object.entries(store.places['Barrios']).map(([key, value]) =>
              <option value={key} className='option'>{key}</option>
            )
          }
        </select>
        {
          store.neighborhood &&
          <select onChange={handleSetDestination} ref={houseRef}>
            <option disabled selected>Elige el lote</option>
            {
              Object.entries(store.places.Barrios[store.neighborhood]).map(([key, value]) =>
                <option value={key} className='option'>{store.neighborhood} {key}</option>
              )
            }
          </select>
        }
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