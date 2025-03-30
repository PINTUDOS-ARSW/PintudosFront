import React from 'react';
import './App.css';

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">Pintudos</h1>
      </div>

      <div className="container">
        <div className="title-container">
          <h2 className="left-title">Unirse a partida</h2>
          <h2 className="right-title">Crear partida</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
