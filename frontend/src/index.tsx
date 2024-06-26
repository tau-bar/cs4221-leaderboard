import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ''}>
    <React.StrictMode>
      <MantineProvider>
        <BrowserRouter>
          <Notifications />
          <App />
          <Notifications />
        </BrowserRouter>
      </MantineProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
