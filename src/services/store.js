import React, { createContext, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { observable } from 'mobx'


const store = observable({

  config: window.APP_ENV,

  places: window.PLACES,

  origin: null,

  destination: null,

  directions: null,

  error: null,

  currentPosition: null,

  entrance: window.PLACES['Entrada']['Principal'],

})

const StoreContext = createContext()

export const StoreProvider = observer((props) => (
  <StoreContext.Provider {...props} value={store} />
))

export const useStore = () => useContext(StoreContext)