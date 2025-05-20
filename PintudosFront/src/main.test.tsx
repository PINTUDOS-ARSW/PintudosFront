// src/__tests__/App.test.tsx (o donde esté tu test)
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { WebSocketProvider } from './useWebSocket';

// Mock completo para createRoot con render y unmount
jest.mock('react-dom/client', () => ({
  createRoot: () => ({
    render: jest.fn(),
    unmount: jest.fn(),  // <-- Agregado para evitar el error
  }),
}));

test('renderiza App dentro de WebSocketProvider sin errores', () => {
  render(
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  );
});
