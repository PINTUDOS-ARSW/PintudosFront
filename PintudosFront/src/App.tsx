import React from 'react';
import './App.css';
import Button from './components/Button/Button';
import Logo from './components/Logo/Logo';
import Modal from './components/Modal/Modal';
import Modal2 from './components/Modal2/Modal2';

function App() {
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-600 relative">
      {/* Contenedor blanco con logo y botones */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <Logo src="/titulo.svg" alt="Logo Pintu2" />
        <div className="flex flex-col gap-4 mt-4">
          <Button className="btn_d" onClick={() => setShow(true)}>Unirse a partida</Button>
          <Button className="btn_u" onClick={() => setShow2(true)}>Crear partida</Button>
        </div>
      </div>

      {/* Modales encima de todo */}
      {show && <Modal show={show} setShow={setShow} />}
      {show2 && <Modal2 show2={show2} setShow2={setShow2} />}
    </div>
  );
}

export default App;
