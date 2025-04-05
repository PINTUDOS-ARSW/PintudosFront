import React from "react";
import "./Palabras.css";

export default function Palabra() {
  const palabra = "Sol"; // Puedes cambiarla dinámicamente si quieres

  return (
        <div className="cuadro-naranja">
          {palabra}
        </div>
  );
}