import React, { use } from 'react';
import { useEffect, useRef } from 'react';
function Canvas(){
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [dibujando, setDibujando] = React.useState(false);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth - 20;
            canvas.height = window.innerHeight - 20;
        }
},[])

    const evtIniciaDibujo = (evt: React.MouseEvent<HTMLCanvasElement>) => {
        setDibujando(true);
        evtDibujaCanvas(evt);
    };

    const evtTerminaDibujo = (evt: React.MouseEvent<HTMLCanvasElement>) => {
        setDibujando(false);
        evtDibujaCanvas(evt);
    }

    interface CanvasMouseEvent extends React.MouseEvent<HTMLCanvasElement> {
        clientX: number;
        clientY: number;
    }

    const evtDibujaCanvas = (evt: CanvasMouseEvent) => {
        if (!dibujando) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const mouseX = evt.clientX - canvas.getBoundingClientRect().left;
        const mouseY = evt.clientY - canvas.getBoundingClientRect().top;

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
    onMouseDown={evtIniciaDibujo}
    onMouseMove = {evtDibujaCanvas}
    onMouseUp={evtTerminaDibujo}>
    </canvas>
)}
export default Canvas;


