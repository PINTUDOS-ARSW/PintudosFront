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
      const response = await axios.get(`http://localhost:8080/game/${roomId}/secret-word`);
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
      const response = await axios.get(`http://localhost:8080/game/${roomId}/clue`);
      setClue(response.data); // Mostrar la pista obtenida desde el backend
      setHasClue(true); // Marcar que un jugador ya obtuvo la pista
    } catch (error) {
      console.error("Error al obtener la pista:", error);
      setClue("Error al obtener la pista");
    }
  };

  return (
    <div className="game-background">
      <h2 className="player-info">Jugador: {player}</h2>
      <Canvas roomId={roomId} player={player} />
      <Chat roomId={roomId} username={player} />

      {/* Obtener palabra secreta */}
      <button
        onClick={fetchSecretWord}
        className="fetch-secret-word-button"
        disabled={player !== "indefinido" && player !== undefined}
      >
        Obtener Palabra Secreta
      </button>
      {secretWord && <p className="secret-word">Palabra Secreta: {secretWord}</p>}

      {/* Obtener pista */}
      <button
        onClick={fetchClue}
        className="fetch-clue-button"
        disabled={hasClue}
      >
        Obtener Pista
      </button>
      {clue && <p className="clue">Pista: {clue}</p>}
    </div>
  );
}
