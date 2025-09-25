import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    {/* <GoogleOAuthProvider clientId="378986459445-6nvr305t74ok25i0gvfmrl35nc0uk9co.apps.googleusercontent.com"> */}
      <App />
    {/* </GoogleOAuthProvider> */}
  </Provider>
  // {/* </React.StrictMode> */}
);
