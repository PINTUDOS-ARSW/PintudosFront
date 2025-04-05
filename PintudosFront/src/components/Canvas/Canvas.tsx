import React, { useRef, useState, useEffect } from 'react';
import { useWebSocket } from '../../useWebSocket';

// Interfaces
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

        // Dibujo local
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;

        const prev = puntos[puntos.length - 1];
        if (prev) {
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(nuevaPos.x, nuevaPos.y);
            ctx.stroke();

            // Enviar segmento en tiempo real
            const trace: Trace = {
                roomId: roomId,
                points: [
                    {
                        type: "Point",
                        coordinates: [prev.x, prev.y],
                        longitude: prev.x,
                        latitude: prev.y
                    },
                    {
                        type: "Point",
                        coordinates: [nuevaPos.x, nuevaPos.y],
                        longitude: nuevaPos.x,
                        latitude: nuevaPos.y
                    }
                ],
                color: 'black',
                width: 3
            };
            sendMessage(roomId, trace);
        }
    };

    const evtIniciaDibujo = (evt: React.MouseEvent<HTMLCanvasElement>) => {
        setDibujando(true);
        const pos = obtenerCoordenadas(evt);
        setPuntos([pos]);
    };

    const evtTerminaDibujo = () => {
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
            canvas.width = 600; // Reducido a 600px de ancho
            canvas.height = 400; // Reducido a 400px de alto
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{
                border: '1px solid black',
                backgroundColor: 'white',
                cursor: 'crosshair',
                width: '600px',
                height: '400px'
            }}
            onMouseDown={evtIniciaDibujo}
            onMouseMove={evtDibujaCanvas}
            onMouseUp={evtTerminaDibujo}
            onMouseLeave={evtTerminaDibujo}
        />
    );
}

export default Canvas;
