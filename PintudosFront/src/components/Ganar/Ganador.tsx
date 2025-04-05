// src/components/Ganador.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Ganador.css";

interface GanadorProps {
  ganador: string;
  show5: boolean;
  setShow5: (show: boolean) => void;
}

export default function Ganador({ ganador, show5, setShow5 }: GanadorProps) {
  const navigate = useNavigate();

  const handleVolver = () => {
    setShow5(true); // opcional si quieres ocultarlo antes de navegar
    navigate("/");
  };

  if (!show5) return null;

  return (
    <div className="background8">
      <div className="window5">
        <div className="titulo">Fin de la partida</div>
        <div className="ganador">El ganador es: <strong>{ganador}</strong></div>
        <button className="volver-btn" onClick={handleVolver}>
          Volver a jugar
        </button>
      </div>
    </div>
  );
}
