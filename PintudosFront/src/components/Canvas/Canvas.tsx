import React, { useRef, useState, useEffect } from 'react';
import { useWebSocket } from '../../useWebSocket';

// Definir interfaces
interface Point {
    x: number;
    y: number;
}

interface CustomPoint {
    type: string;
    coordinates: [number, number];
    longitude: number;
    latitude: number;
}

interface Trace {
    roomId: string;
    points: CustomPoint[];
    color: string;
    width: number;
}

function Canvas({ roomId }: { roomId: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dibujando, setDibujando] = useState(false);
    const [puntos, setPuntos] = useState<Point[]>([]);
    const { sendMessage, connected, subscribeToTraces } = useWebSocket();

    useEffect(() => {
        if (!connected) return;
      
        subscribeToTraces(roomId, (trace: Trace) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!ctx) return;

            ctx.beginPath();
            ctx.strokeStyle = trace.color || 'black';
            ctx.lineWidth = trace.width || 3;

            trace.points.forEach((point: CustomPoint, index: number) => {
                if (index === 0) {
                    ctx.moveTo(point.longitude, point.latitude);
                } else {
                    ctx.lineTo(point.longitude, point.latitude);
                }
            });
            ctx.stroke();
        });
    }, [connected, roomId]);

    const evtDibujaCanvas = (evt: React.MouseEvent<HTMLCanvasElement>) => {
        if (!dibujando) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const nuevaPos = obtenerCoordenadas(evt);
        const nuevosPuntos = [...puntos, nuevaPos];
        setPuntos(nuevosPuntos);

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        
        nuevosPuntos.forEach((point: Point, index: number) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
    };

    const evtIniciaDibujo = (evt: React.MouseEvent<HTMLCanvasElement>) => {
        setDibujando(true);
        const pos = obtenerCoordenadas(evt);
        setPuntos([pos]);
    };

    const evtTerminaDibujo = () => {
        if (puntos.length > 0) {
            const trace: Trace = {
                roomId: roomId,
                points: puntos.map(p => ({
                    type: "Point",
                    coordinates: [p.x, p.y],
                    longitude: p.x,
                    latitude: p.y
                })),
                color: 'black',
                width: 3
            };
            sendMessage(roomId, JSON.stringify(trace));
        }
        setDibujando(false);
        setPuntos([]);
    };

    const obtenerCoordenadas = (evt: React.MouseEvent<HTMLCanvasElement>): Point => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth - 20;
            canvas.height = window.innerHeight - 20;
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ 
                border: '1px solid black', 
                backgroundColor: 'white', 
                cursor: 'crosshair'
            }}
            onMouseDown={evtIniciaDibujo}
            onMouseMove={evtDibujaCanvas}
            onMouseUp={evtTerminaDibujo}
            onMouseLeave={evtTerminaDibujo}
        />
    );
}

export default Canvas;