// src/pages/Juego.tsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Juego.css";
import Canvas from "../Canvas/Canvas";
import Chat from "../Chat/Chat";

export default function Juego() {
  const location = useLocation();
  const { roomId, player } = location.state || {}; // <- extrae también player

  useEffect(() => {
    console.log("🟣 Room ID recibido en Juego:", roomId);
    console.log("🟢 Jugador:", player);
  }, [roomId, player]);

  return (
    <div className="game-background">
      <h2 className="player-info">Jugador: {player}</h2>
      <Canvas roomId={roomId} player={player} />
      <Chat roomId={roomId} username={player} /> {/* <- ✅ corregido aquí */}
    </div>
  );
}
