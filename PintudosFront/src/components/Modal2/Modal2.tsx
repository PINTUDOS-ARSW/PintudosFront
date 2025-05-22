import React, { useState, useEffect } from 'react';
import './Modal2.css';
import { useWebSocket } from './../../useWebSocket'; 
import { useNavigate } from 'react-router-dom'; // Añadir esta importación

interface ModalProps {
  show2: boolean;
  setShow2(show: boolean): void;
  onRoomCreated?: (roomId: string) => void; 
}

export default function Modal2(props: ModalProps) {
  const [roomId, setRoomId] = useState('');
  const [player, setPlayer] = useState('Anfitrión'); // Añadir nombre del jugador
  const { createRoom, connected } = useWebSocket(); 
  const navigate = useNavigate(); // Añadir el hook de navegación

  useEffect(() => {
    if (props.show2 && connected && roomId === '') {
      // Generar un número aleatorio de 6 dígitos usando CSPRNG
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const newRoomId = (100000 + (array[0] % 900000)).toString().padStart(6, '0');
      setRoomId(newRoomId);
      createRoom(newRoomId, player); // Pasar el nombre del jugador
      console.log("✅ Nueva sala creada con ID:", newRoomId);
      
      if (props.onRoomCreated) {
        props.onRoomCreated(newRoomId);
      }
      
      // Esperar un breve momento antes de redirigir
      setTimeout(() => {
        navigate("/juego", {
          state: {
            roomId: newRoomId,
            player: player
          }
        });
      }, 2000); // Redirigir después de 2 segundos para que el usuario vea el código
    }
  }, [props.show2, connected, navigate]);
  
  // Permitir que el usuario ingrese su nombre
  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer(e.target.value);
  };

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
            
            {/* Añadir campo para el nombre del jugador */}
            <div className="player-input-container">
              <label htmlFor="player-name">Tu nombre:</label>
              <input 
                id="player-name"
                type="text" 
                value={player} 
                onChange={handlePlayerNameChange}
                className="player-input"
              />
            </div>
            
            <div className="message2">Redirigiendo al juego...</div>
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