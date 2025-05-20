import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  test('renderiza el contenido del botón', () => {
    render(<Button>Click aquí</Button>);
    expect(screen.getByText('Click aquí')).toBeInTheDocument();
  });

  test('aplica clases adicionales correctamente', () => {
    render(<Button className="custom-class">Texto</Button>);
    const button = screen.getByText('Texto');
    expect(button).toHaveClass('custom-class');
  });

  test('ejecuta el onClick cuando se hace clic', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Presionar</Button>);
    fireEvent.click(screen.getByText('Presionar'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
