import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Juego from './Juego';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock de los componentes hijos (Canvas y Chat)
jest.mock('../Canvas/Canvas', () => () => <div>Mock Canvas</div>);
jest.mock('../Chat/Chat', () => () => <div>Mock Chat</div>);

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de useLocation para simular props de navegación
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      roomId: 'room123',
      player: 'indefinido',
    },
  }),
}));

describe('Juego component', () => {
  beforeEach(() => {
    mockedAxios.get.mockClear(); // Limpia llamadas previas al mock
  });

  test('renderiza correctamente con Canvas y Chat', () => {
    render(
      <MemoryRouter>
        <Juego />
      </MemoryRouter>
    );
    expect(screen.getByText(/Jugador: indefinido/)).toBeInTheDocument();
    expect(screen.getByText(/Mock Canvas/)).toBeInTheDocument();
    expect(screen.getByText(/Mock Chat/)).toBeInTheDocument();
    expect(screen.getByText(/Obtener Palabra Secreta/)).toBeInTheDocument();
    expect(screen.getByText(/Obtener Pista/)).toBeInTheDocument();
  });

  test('llama a axios.get para obtener la palabra secreta', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: 'manzana' });

    render(
      <MemoryRouter>
        <Juego />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Obtener Palabra Secreta'));

    await waitFor(() =>
      expect(screen.getByText(/Palabra Secreta: manzana/)).toBeInTheDocument()
    );
  });

  test('llama a axios.get una sola vez para la pista y muestra la pista', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: 'fruta roja' });

    render(
      <MemoryRouter>
        <Juego />
      </MemoryRouter>
    );

    const botonPista = screen.getByText('Obtener Pista');

    // Primer clic: dispara llamada axios.get
    fireEvent.click(botonPista);

    // Esperamos que la pista se muestre en pantalla
    await waitFor(() =>
      expect(screen.getByText(/Pista: fruta roja/)).toBeInTheDocument()
    );

    // La llamada a axios.get solo debe haberse ejecutado una vez
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    // Segundo clic: no debería llamar axios.get otra vez
    fireEvent.click(botonPista);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
