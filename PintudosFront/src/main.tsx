// src/main.tsx o src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WebSocketProvider } from './useWebSocket'; // Ajusta la ruta si es necesario

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </React.StrictMode>
);
