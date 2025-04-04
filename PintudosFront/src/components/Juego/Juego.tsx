import React from "react";
import "./Juego.css";
import Canvas from "../Canvas/Canvas"; // Asegúrate de que la ruta sea correcta
export default function Juego() {
  return (
    <div className="game-background"> 
    <Canvas></Canvas>
    </div>
  );
}