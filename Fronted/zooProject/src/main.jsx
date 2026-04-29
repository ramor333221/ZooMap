import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import LoginComponent from './Components/Login.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <LoginComponent></LoginComponent>
  </React.StrictMode>
);