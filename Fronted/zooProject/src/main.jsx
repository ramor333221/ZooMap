import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import { Provider } from 'react-redux';
import App from './App';
import { store } from './Api/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
=======
<<<<<<< HEAD
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
=======
import { Provider } from 'react-redux';
import App from './App';
import { store } from './Api/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
>>>>>>> a203a59 (change to redux-toolkit and react hook forms)
>>>>>>> 7124956af3128d837ba8795da7013e06a3061248
  </React.StrictMode>
);