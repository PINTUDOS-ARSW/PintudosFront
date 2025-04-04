import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home'; // Ajusta la ruta según la ubicación real del archivo Home
import Juego from './components/Juego/Juego'; // Ajusta la ruta según la ubicación real del archivo Juego

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/juego" element={<Juego />} />
      </Routes>
    </Router>
  );
}

export default App;
