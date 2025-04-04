import React from 'react';
import './Home.css';
import Button from '../Button/Button';
import Logo from '../Logo/Logo';
import Modal from '../Modal/Modal';
import Modal2 from '../Modal2/Modal2';
import Wait from '../Wait/Wait'; // Asegúrate de importar tu componente Wait

function Home() {
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [show3, setShow3] = React.useState(false); // este es el del lobby
  const [roomId, setRoomId] = React.useState(''); // <--- aquí se guarda el ID generado

  return (
    <div className="home-background">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <Logo src="/titulo.svg" alt="Logo Pintu2" />
        <div className="flex flex-col gap-4 mt-4">
          <Button className="btn_d" onClick={() => setShow(true)}>Unirse a partida</Button>
          <Button className="btn_u" onClick={() => setShow2(true)}>Crear partida</Button>
        </div>
      </div>

      {/* Modales encima de todo */}
      {show && <Modal show={show} setShow={setShow} />}
      {show2 && <Modal2 show2={show2} setShow2={setShow2} onRoomCreated={(id) => {
        setRoomId(id);         // Guarda el ID generado
        setShow3(true);        // Muestra la pantalla de espera
        setShow2(false);       // Cierra el modal de crear partida
      }} />}
      {show3 && <Wait show3={show3} setShow3={setShow3} roomId={roomId} />}
    </div>
  );
}


export default Home;
