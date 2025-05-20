import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Canvas from './Canvas';
import { useWebSocket } from '../../useWebSocket';

// Mock del contexto WebSocket
jest.mock('../../useWebSocket');

const mockSendMessage = jest.fn();
const mockSubscribeToTraces = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useWebSocket as jest.Mock).mockReturnValue({
    sendMessage: mockSendMessage,
    connected: true,
    subscribeToTraces: mockSubscribeToTraces,
  });
});

describe('Canvas', () => {
  test('se renderiza correctamente', () => {
    const { container } = render(<Canvas roomId="sala123" player="indefinido" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('no permite dibujar si player está definido', () => {
    const { container } = render(<Canvas roomId="sala123" player="jugador1" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    if (canvas) {
      fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.mouseUp(canvas);
    }

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  test('se suscribe a trazos al conectarse', () => {
    render(<Canvas roomId="sala123" player="indefinido" />);
    expect(mockSubscribeToTraces).toHaveBeenCalledWith('sala123', expect.any(Function));
  });
});
