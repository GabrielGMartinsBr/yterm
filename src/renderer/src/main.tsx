import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

import '@xterm/xterm/css/xterm.css'
import './assets/index.css'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);