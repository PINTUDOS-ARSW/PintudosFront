// src/components/Modal/Modal.tsx
import React, { useState } from 'react';
import './Modal.css';
import Wait from '../Wait/Wait';
import  { useWebSocket }  from './../../useWebSocket';
import { useNavigate } from "react-router-dom";


interface ModalProps {
  show: boolean;
  setShow(show: boolean): void;
}

export default function Modal(props: ModalProps) {
  const [roomId, setRoomId] = useState('');
  const [player, setPlayer] = useState('');
  const [show3, setShow3] = useState(false);
  const { joinRoom } = useWebSocket();

  const navigate = useNavigate(); 

const handleJoin = () => {
  if (roomId && player) {
    joinRoom(roomId, player);
    navigate("/juego", {
      state: {
        roomId,
        player,
      },
    });
  }
};

  if (props.show) {
    return (
      <div className="background">
        <div className="window">
          <div className="title">Unirse a una partida</div>
          <div className="message">Código de partida</div>
          <div className="button">
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder="123456"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <input
                type="text"
                className="input"
                placeholder="Tu nombre"
                value={player}
                onChange={(e) => setPlayer(e.target.value)}
              />
              <button className="button-join" onClick={handleJoin}>Unirse</button>
              {show3 && <Wait show3={show3} setShow3={setShow3} roomId={roomId} />}
            </div>
            {!show3 && (
              <button className="button-close" onClick={() => props.setShow(false)}>
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
