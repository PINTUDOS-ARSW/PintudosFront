import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Juego.css";
import Canvas from "../Canvas/Canvas";
import Chat from "../Chat/Chat";

export default function Juego() {
  const location = useLocation();
  const { roomId } = location.state || {};

  useEffect(() => {
    console.log("🟣 Room ID recibido en Juego:", roomId);
  }, [roomId]);
  console.log("roomId recibido en Juego.tsx:", roomId);

  return (
    <div className="game-background">
      <Canvas roomId={roomId} />
      <Chat roomId={roomId} />
    </div>
  );
}
