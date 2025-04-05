import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wait.css";
import { useWebSocket } from "../../useWebSocket";

interface ModalProps {
  show3: boolean;
  setShow3(show: boolean): void;
  roomId: string;
}

export default function Wait(props: ModalProps) {
  const [jugadores, setJugadores] = useState(1);
  const navigate = useNavigate();
  const { subscribeToPlayerCount } = useWebSocket();

  useEffect(() => {
    if (!props.roomId) return;

    const unsub = subscribeToPlayerCount(props.roomId, (count: number) => {
      setJugadores(count);
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [props.roomId, subscribeToPlayerCount]);

  useEffect(() => {
    if (jugadores >= 3) {
      setTimeout(() => {
        navigate("/juego", { state: { roomId: props.roomId } });
      }, 1000);
    }
  }, [jugadores, navigate, props.roomId]);

  if (!props.show3) return null;

  return (
    <div className="background3">
      <div className="window3">
        <div className="title3">Unirse a una partida</div>
        <div className="message3">Ya estás dentro</div>
        <div className="message4">Esperando a otros jugadores...</div>

        <div style={{ margin: "10px 0", fontSize: "1.2rem", fontWeight: "bold", color: "#000", fontFamily: "'Finger Paint', cursive" }}>
          Código de sala: {props.roomId}
        </div>

        <p style={{ marginTop: "10px",fontSize: "1.2rem", fontWeight: "bold", color: "#000",fontFamily: "'Finger Paint', cursive" }}>Jugadores conectados: {jugadores}</p>

        <div className="pendulum">
          <div className="pendulum_box">
            <div className="ball first"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball last"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
