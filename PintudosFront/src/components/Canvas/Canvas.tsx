import React, { use } from 'react';
import { useEffect, useRef } from 'react';
function Canvas(){
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth - 20;
            canvas.height = window.innerHeight - 20;
        }
},[])

    interface CanvasMouseEvent extends React.MouseEvent<HTMLCanvasElement> {
        clientX: number;
        clientY: number;
    }

    const evtDibujaCanvas = (evt: CanvasMouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const mouseX = evt.clientX;
        const mouseY = evt.clientY;

        if (ctx) {
            ctx.fillStyle = 'black';
            ctx.fillRect(mouseX, mouseY, 5, 5); // Dibuja un rectángulo de 5x5 píxeles en la posición del mouse
        }
    };
    return (
    <canvas
    ref={canvasRef}
    style={{border: '1px solid black'
    , backgroundColor: 'white'}}
    onMouseMove = {evtDibujaCanvas}>
    </canvas>
)}
export default Canvas;


