import React from 'react';
import './App.css';

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
      <img src="/titulo.svg" alt="Logo Pintu2" className="logo" />
      </div>
      <div className="flex flex-col gap-4 mt-4">
          <button className="btn_d">Unirse a partida</button>
          <button className="btn_u">Crear partida</button>
      </div>
      </div>
  );
}

export default App;
