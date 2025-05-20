import React from 'react';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';

describe('Logo component', () => {
  test('renderiza la imagen con src y alt correctos', () => {
    render(<Logo src="/logo.png" alt="Logo de prueba" />);

    const img = screen.getByAltText('Logo de prueba') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/logo.png'); // depende del entorno de pruebas
    expect(img.className).toBe('logo');
  });
});
