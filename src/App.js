import React from 'react';
import { RouterProvider } from 'react-router-dom';

import router from './navigation/router';
import { observer } from 'mobx-react-lite'

import './App.scss';


const App = observer(() => {
  return (
    <div className="app-container">
      <RouterProvider router={router} />
    </div>
  );
})

export default App;