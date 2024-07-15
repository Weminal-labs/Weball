import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AptimusFlowProvider } from 'aptimus-sdk-test/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AptimusFlowProvider apiKey="aptimus_apikey_ec23ee0a581fca24263243bc89f77bdf">

  <React.StrictMode>
    <App />
  </React.StrictMode>
  </AptimusFlowProvider>

)
