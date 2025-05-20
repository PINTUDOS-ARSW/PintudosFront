import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from './Chat';
import { useWebSocket } from '../../useWebSocket';
import { BrowserRouter } from 'react-router-dom';

// Mock de useNavigate a nivel de módulo
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock de useWebSocket
jest.mock('../../useWebSocket');

// Mocks de funciones
const mockSendMessage = jest.fn();
let callbackChat: (msg: any) => void = () => {};
const mockSubscribeToChat = jest.fn((_roomId: string, callback: (msg: any) => void) => {
  callbackChat = callback;
  return { unsubscribe: jest.fn() };
});

beforeEach(() => {
  jest.clearAllMocks();
  (useWebSocket as jest.Mock).mockReturnValue({
    sendMessage: mockSendMessage,
    subscribeToChat: mockSubscribeToChat,
    connected: true,
  });
});

const renderWithRouter = () =>
  render(
    <BrowserRouter>
      <Chat roomId="sala123" username="diego" />
    </BrowserRouter>
  );

describe('Chat component', () => {
  test('renderiza correctamente', () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeInTheDocument();
    expect(screen.getByText('Enviar')).toBeInTheDocument();
  });

  test('envía mensaje cuando se hace clic en enviar', () => {
    renderWithRouter();
    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    const button = screen.getByText('Enviar');

    fireEvent.change(input, { target: { value: 'Hola' } });
    fireEvent.click(button);

    expect(mockSendMessage).toHaveBeenCalledWith('sala123', 'Hola', 'chat', 'diego');
  });

  test('muestra mensajes recibidos', async () => {
    renderWithRouter();
    callbackChat({ sender: 'otro', message: 'mensaje de prueba' });

    expect(await screen.findByText(/mensaje de prueba/)).toBeInTheDocument();
  });

  test('muestra modal cuando se recibe mensaje de ganador', async () => {
    renderWithRouter();
    callbackChat({ sender: 'System', message: 'Diego ganó la partida' });

    expect(await screen.findByText(/Diego ganó la partida/)).toBeInTheDocument();
    expect(screen.getByText('Cerrar')).toBeInTheDocument();
  });

  test('redirige al home si se recibe REDIRECT_HOME', async () => {
    renderWithRouter();
    callbackChat({ sender: 'System', message: 'REDIRECT_HOME' });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
