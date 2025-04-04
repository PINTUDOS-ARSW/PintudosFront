import React, { useRef, useState, useEffect } from 'react';

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dibujando, setDibujando] = useState(false);
  const [posicionAnterior, setPosicionAnterior] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth - 20;
      canvas.height = window.innerHeight - 20;
    }
  }, []);

  const obtenerCoordenadas = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  const evtIniciaDibujo = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    setDibujando(true);
    const pos = obtenerCoordenadas(evt);
    setPosicionAnterior(pos);
  };

  const evtTerminaDibujo = () => {
    setDibujando(false);
    setPosicionAnterior(null);
  };

  const evtDibujaCanvas = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dibujando) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const nuevaPos = obtenerCoordenadas(evt);

    if (posicionAnterior) {
      ctx.beginPath();
      ctx.moveTo(posicionAnterior.x, posicionAnterior.y);
      ctx.lineTo(nuevaPos.x, nuevaPos.y);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.closePath();
    }

    setPosicionAnterior(nuevaPos);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ border: '1px solid black', backgroundColor: 'white' }}
      onMouseDown={evtIniciaDibujo}
      onMouseMove={evtDibujaCanvas}
      onMouseUp={evtTerminaDibujo}
      onMouseLeave={evtTerminaDibujo}
    />
  );
}

export default Canvas;
