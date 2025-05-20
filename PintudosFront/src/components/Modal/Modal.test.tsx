import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';
import { useWebSocket } from '../../useWebSocket';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock de useWebSocket
jest.mock('../../useWebSocket');
const mockJoinRoom = jest.fn();
(useWebSocket as jest.Mock).mockReturnValue({ joinRoom: mockJoinRoom });

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock del componente Wait
jest.mock('../Wait/Wait', () => () => <div>Mock Wait</div>);

describe('Modal component', () => {
  test('renderiza el modal cuando show=true', () => {
    render(
      <MemoryRouter>
        <Modal show={true} setShow={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('Unirse a una partida')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('123456')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument();
  });

  test('cierra el modal cuando se hace clic en "Cerrar"', () => {
    const setShowMock = jest.fn();

    render(
      <MemoryRouter>
        <Modal show={true} setShow={setShowMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Cerrar'));
    expect(setShowMock).toHaveBeenCalledWith(false);
  });

  test('envía los datos y navega al hacer clic en "Unirse"', () => {
    render(
      <MemoryRouter>
        <Modal show={true} setShow={() => {}} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('123456'), {
      target: { value: 'room123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), {
      target: { value: 'Diego' },
    });
    fireEvent.click(screen.getByText('Unirse'));

    expect(mockJoinRoom).toHaveBeenCalledWith('room123', 'Diego');
    expect(mockNavigate).toHaveBeenCalledWith('/juego', {
      state: { roomId: 'room123', player: 'Diego' },
    });
  });

  test('no renderiza el modal si show=false', () => {
    const { container } = render(
      <MemoryRouter>
        <Modal show={false} setShow={() => {}} />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
