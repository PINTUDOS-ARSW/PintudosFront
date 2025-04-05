import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Juego.css";
import Canvas from "../Canvas/Canvas";
import Chat from "../Chat/Chat";
import Palabra from "../Palabras/Palabras"; // Ensure the file exists at src/components/Palabra/Palabra.tsx or update the path accordingly

export default function Juego() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = location.state || {};
  const [showButton, setShowButton] = useState(false);
  const [position, setPosition] = useState({ top: 100, left: 100 });
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos = 300 segundos

  // Mostrar botón cada minuto en posición aleatoria
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * (window.innerHeight - 60));
      const randomLeft = Math.floor(Math.random() * (window.innerWidth - 150));
      setPosition({ top: randomTop, left: randomLeft });
      setShowButton(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    alert("¡Botón clickeado! 🎉");
    setShowButton(false);
  };

  // Temporizador de partida (5 minutos)
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          alert("⏰ ¡La partida ha terminado!");
          navigate("/"); // redirige a Home
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // cada segundo

    return () => clearInterval(countdown);
  }, [navigate]);

  // Opcional: formateo mm:ss
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div>
      <div className="game-background">
        <Canvas roomId={roomId} />
        <Chat roomId={roomId} username="defaultUsername" />
        <div className="timer">⏱️ Tiempo restante: {formatTime(timeLeft)}</div>
      </div>
      <div className="palabra">
        <Palabra />
      </div>

      {showButton && (
        <button
          className="floating-button"
          onClick={handleClick}
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          ¡Haz clic aquí!
        </button>
      )}
    </div>
  );
}