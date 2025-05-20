import React, { useState, useEffect } from 'react';
import './Modal2.css';
import { useWebSocket } from './../../useWebSocket'; 

interface ModalProps {
  show2: boolean;
  setShow2(show: boolean): void;
  onRoomCreated?: (roomId: string) => void; 
}

export default function Modal2(props: ModalProps) {
  const [roomId, setRoomId] = useState('');
  const { createRoom, connected } = useWebSocket(); 

  useEffect(() => {
    if (props.show2 && connected && roomId === '') {
      // Generar un número aleatorio de 6 dígitos usando CSPRNG
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const newRoomId = (100000 + (array[0] % 900000)).toString().padStart(6, '0');
      setRoomId(newRoomId);
      createRoom(newRoomId);
      console.log("✅ Nueva sala creada con ID:", newRoomId);
      props.onRoomCreated?.(newRoomId);
    }
  }, [props.show2, connected]);
  if (!props.show2) {
    return null;
  }

  return (
    <div className="background1">
      <div className="window1">
        <div className="title1">Crear partida</div>
        {!connected ? (
          <>
            <div className="message1">Conectando con el servidor...</div>
            <div className="message2">Por favor espera unos segundos.</div>
          </>
        ) : (
          <>
            <div className="message1">Este es tu código de partida</div>
            <div className="message2">Comparte este código con tus amigos</div>
            <div className="numeros1">{roomId}</div>
          </>
        )}

        <div className="button1">
          <button
            className="button-close1"
            onClick={() => {
              setRoomId('');
              props.setShow2(false);
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
