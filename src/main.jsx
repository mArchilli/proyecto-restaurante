// src/main.jsx o src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Asegúrate de que tu archivo CSS de Tailwind esté importado
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
