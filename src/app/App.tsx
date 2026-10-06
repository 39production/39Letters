import React from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { AbiExperience } from '../letters/01-abi/AbiExperience'
import { BayuExperience } from '../letters/02-bayu/BayuExperience'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 39LETTERS */}

        <Route
          path="/l/01"
          element={<AbiExperience />}
        />

        <Route
          path="/l/02"
          element={<BayuExperience />}
        />

        {/* Fallback */}

        <Route
          path="*"
          element={
            <Navigate
              to="/l/01"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App