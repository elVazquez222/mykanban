import 'react-app-polyfill/ie11'; 
import 'react-app-polyfill/stable'; 
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import Firefox from "./Firefox"

ReactDOM.render(
  <React.StrictMode>
    {navigator.userAgent.indexOf("Firefox") != -1  ? <Firefox /> : 
    <App />}
  </React.StrictMode>,
  document.getElementById('root')
);
