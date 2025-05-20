import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Modal2 from './Modal2';
import { useWebSocket } from '../../useWebSocket';

// Mock del contexto
jest.mock('../../useWebSocket');
const mockCreateRoom = jest.fn();
(useWebSocket as jest.Mock).mockReturnValue({
  createRoom: mockCreateRoom,
  connected: true,
});

// Simular crypto.getRandomValues
global.crypto = {
  getRandomValues: (arr: Uint32Array) => {
    arr[0] = 123456; // número fijo para predictibilidad
    return arr;
  },
} as Crypto;

describe('Modal2 component', () => {
  test('no renderiza nada si show2 es false', () => {
    const { container } = render(<Modal2 show2={false} setShow2={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renderiza correctamente y genera roomId si conectado', async () => {
    const onRoomCreatedMock = jest.fn();

    render(
      <Modal2
        show2={true}
        setShow2={() => {}}
        onRoomCreated={onRoomCreatedMock}
      />
    );

    expect(screen.getByText('Crear partida')).toBeInTheDocument();
    await waitFor(() => {
      expect(mockCreateRoom).toHaveBeenCalledTimes(1);
      expect(onRoomCreatedMock).toHaveBeenCalledWith(expect.any(String));
      expect(screen.getByText(/Este es tu código de partida/)).toBeInTheDocument();
    });
  });

  test('muestra mensaje de conexión si no está conectado', () => {
    (useWebSocket as jest.Mock).mockReturnValueOnce({
      createRoom: mockCreateRoom,
      connected: false,
    });

    render(<Modal2 show2={true} setShow2={() => {}} />);
    expect(screen.getByText(/Conectando con el servidor/)).toBeInTheDocument();
  });

  test('cierra modal al hacer clic en "Cerrar"', () => {
    const setShow2Mock = jest.fn();

    render(
      <Modal2
        show2={true}
        setShow2={setShow2Mock}
        onRoomCreated={() => {}}
      />
    );

    const botonCerrar = screen.getByText('Cerrar');
    fireEvent.click(botonCerrar);

    expect(setShow2Mock).toHaveBeenCalledWith(false);
  });
});
