import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';

// Mocks de los componentes hijos
jest.mock('../Logo/Logo', () => () => <div>Mocked Logo</div>);
jest.mock('../Modal/Modal', () => ({ show, setShow }: any) => (
  show ? <div>Modal Abierto<button onClick={() => setShow(false)}>Cerrar Modal</button></div> : null
));
jest.mock('../Modal2/Modal2', () => ({ show2, setShow2, onRoomCreated }: any) => (
  show2 ? <div>
    Modal2 Abierto
    <button onClick={() => {
      onRoomCreated('room123'); // Simula creación de sala
      setShow2(false);
    }}>Crear Sala</button>
  </div> : null
));
jest.mock('../Wait/Wait', () => ({ show3, setShow3, roomId }: any) => (
  show3 ? <div>Esperando en {roomId}</div> : null
));

describe('Home component', () => {
  test('renderiza botones y logo', () => {
    render(<Home />);
    expect(screen.getByText('Mocked Logo')).toBeInTheDocument();
    expect(screen.getByText('Unirse a partida')).toBeInTheDocument();
    expect(screen.getByText('Crear partida')).toBeInTheDocument();
  });

  test('muestra Modal al hacer clic en "Unirse a partida"', () => {
    render(<Home />);
    fireEvent.click(screen.getByText('Unirse a partida'));
    expect(screen.getByText('Modal Abierto')).toBeInTheDocument();
  });

  test('muestra Wait al crear una partida desde Modal2', () => {
    render(<Home />);
    fireEvent.click(screen.getByText('Crear partida'));
    fireEvent.click(screen.getByText('Crear Sala')); // dispara onRoomCreated

    expect(screen.getByText('Esperando en room123')).toBeInTheDocument();
  });
});
