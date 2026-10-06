import React from 'react'

import { AbiExperience } from '../letters/01-abi/AbiExperience'
import { BayuExperience } from '../letters/02-bayu/BayuExperience'

function App() {
  const pathname = window.location.pathname

  const route =
    pathname
      .replace(/^\/39Letters/, '')
      .replace(/\/+$/, '') || '/'

  if (route === '/l/02') {
    return <BayuExperience />
  }

  return <AbiExperience />
}

export default App