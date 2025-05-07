import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import common from './utils/common';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter
  basename={common.getBaseName()}
    future={{
      v7_startTransition: true,
    }}
  >
    <App />
  </BrowserRouter>
);

