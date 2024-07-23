import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './pages/App';

// Ajoutez ces lignes
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);