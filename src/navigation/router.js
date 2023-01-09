import React from 'react';
import { Route, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import Home from '../containers/home';

const router = createHashRouter(
  createRoutesFromElements(
    <Route
      element={<Home />}
      path="/"
    />
  )
);


export default router;