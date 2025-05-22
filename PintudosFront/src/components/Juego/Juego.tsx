import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Juego.css";
import Canvas from "../Canvas/Canvas";
import Chat from "../Chat/Chat";

export default function Juego() {
  const location = useLocation();
  const { roomId, player } = location.state || {};
  const [secretWord, setSecretWord] = useState<string | null>(null);
  const [clue, setClue] = useState<string | null>(null); // Estado para almacenar la pista
  const [hasClue, setHasClue] = useState(false); // Controla si el jugador ya vio la pista

  useEffect(() => {
    console.log("🟣 Room ID recibido en Juego:", roomId);
    console.log("🟢 Jugador:", player);
  }, [roomId, player]);

  // Función para obtener la palabra secreta
  const fetchSecretWord = async () => {
    if (!roomId) {
      alert("Room ID no disponible");
      return;
    }

    try {
      const response = await axios.get(`https://api.arswpintudos.com/game/${roomId}/secret-word`);
      setSecretWord(response.data);
    } catch (error) {
      console.error("Error al obtener la palabra secreta:", error);
      setSecretWord("Error al obtener la palabra secreta");
    }
  };

  // Función para obtener la pista (solo el primero que lo haga la verá)
  const fetchClue = async () => {
    if (!roomId || hasClue) { // Si ya se obtuvo la pista, no permitir más clics
      return;
    }

    try {
      const response = await axios.get(`https://api.arswpintudos.com/game/${roomId}/clue`);
      setClue(response.data); // Mostrar la pista obtenida desde el backend
      setHasClue(true); // Marcar que un jugador ya obtuvo la pista
    } catch (error) {
      console.error("Error al obtener la pista:", error);
      setClue("Error al obtener la pista");
    }
  };
  
  // Función para obtener posiciones aleatorias usando CSPRNG
  const getRandomPosition = () => {
    const array = new Uint32Array(2);
    window.crypto.getRandomValues(array);
    const top = Math.floor((array[0] / (0xFFFFFFFF + 1)) * (window.innerHeight - 100));
    const left = Math.floor((array[1] / (0xFFFFFFFF + 1)) * (window.innerWidth - 100));
    return { top, left };
  };

  const randomPosition = getRandomPosition();


    return (
    <div className="game-background">
      {/* Sección superior con el nombre del jugador y el botón de obtener palabra secreta */}
      <div className="top-section">
        <h2 className="player-info">Jugador: {player}</h2>
        <button
          onClick={fetchSecretWord}
          className="fetch-secret-word-button"
          disabled={player !== "indefinido" && player !== undefined}
        >
          Obtener Palabra Secreta
        </button>
      </div>
     {/* Canvas y Chat en el centro */}
      <div className="middle-section">
        <Canvas roomId={roomId} player={player} />
        <Chat roomId={roomId} username={player} />
      </div>
    {/* Botón para obtener pista con posición aleatoria */}
     <button
        onClick={fetchClue}
        className="fetch-clue-button"
        disabled={hasClue}
        style={{ position: 'absolute', top: randomPosition.top, left: randomPosition.left }}
        >
        Obtener Pista
      </button>
      {secretWord && (
        <p className="secret-word">Palabra Secreta: {secretWord}</p>
      )}

      {clue && <p className="clue">Pista: {clue}</p>}
    </div>
  );
}
