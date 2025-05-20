import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import Wait from './Wait';
import { useWebSocket } from '../../useWebSocket';
import { MemoryRouter } from 'react-router-dom';

// Mock del contexto WebSocket
jest.mock('../../useWebSocket');
const mockSubscribeToPlayerCount = jest.fn();

(useWebSocket as jest.Mock).mockReturnValue({
  subscribeToPlayerCount: mockSubscribeToPlayerCount,
});

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Wait component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('no se renderiza si show3 es false', () => {
    const { container } = render(
      <Wait show3={false} setShow3={() => {}} roomId="room123" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('se renderiza si show3 es true', () => {
    render(
      <MemoryRouter>
        <Wait show3={true} setShow3={() => {}} roomId="room123" />
      </MemoryRouter>
    );

    expect(screen.getByText('Unirse a una partida')).toBeInTheDocument();
    expect(screen.getByText(/Esperando a otros jugadores/)).toBeInTheDocument();
    expect(screen.getByText(/Código de sala: room123/)).toBeInTheDocument();
    expect(mockSubscribeToPlayerCount).toHaveBeenCalledWith(
      'room123',
      expect.any(Function)
    );
  });

  test('redirige a /juego si hay 3 o más jugadores', async () => {
    let callback: (count: number) => void = () => {};
    mockSubscribeToPlayerCount.mockImplementation((_, cb) => {
      callback = cb;
      return jest.fn(); // simulamos función de unsubscribe
    });

    render(
      <MemoryRouter>
        <Wait show3={true} setShow3={() => {}} roomId="room123" />
      </MemoryRouter>
    );

    // Llamamos callback dentro de act para evitar warnings de React
    await act(async () => {
      callback(3);
    });

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/juego', {
        state: { roomId: 'room123' },
      })
    );
  });
});
