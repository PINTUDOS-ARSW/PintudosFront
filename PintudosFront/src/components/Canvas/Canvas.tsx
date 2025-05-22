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

function Canvas({ roomId, player }: { roomId: string; player: string | undefined }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dibujando, setDibujando] = useState(false);
    const [puntos, setPuntos] = useState<Point[]>([]);
    const { sendMessage, connected, subscribeToTraces, waitForConnection } = useWebSocket();
    const [isSubscribed, setIsSubscribed] = useState(false);

    // Suscribirse a los trazos solo cuando la conexión está lista
    useEffect(() => {
        if (!roomId || isSubscribed) return;
        
        // Usar waitForConnection para asegurar que la conexión esté lista
        waitForConnection(() => {
            try {
                console.log("🎨 Suscribiéndose a trazos para la sala:", roomId);
                
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
                
                setIsSubscribed(true);
                console.log("✅ Suscripción a trazos completada");
            } catch (error) {
                console.error("❌ Error al suscribirse a los trazos:", error);
            }
        });
    }, [roomId, waitForConnection, subscribeToTraces, isSubscribed]);

    const evtDibujaCanvas = (evt: React.MouseEvent<HTMLCanvasElement>) => {
        if (!dibujando || (player !== "indefinido" && player !== undefined)) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const nuevaPos = obtenerCoordenadas(evt);
        const nuevosPuntos = [...puntos, nuevaPos];
        setPuntos(nuevosPuntos);

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;

        const prev = puntos[puntos.length - 1];
        if (prev) {
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(nuevaPos.x, nuevaPos.y);
            ctx.stroke();

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
            
            // Usar waitForConnection para enviar el mensaje
            waitForConnection(() => {
                sendMessage(roomId, JSON.stringify(trace), "trace");
            });
        }
    };

    const evtIniciaDibujo = (evt: React.MouseEvent<HTMLCanvasElement>) => {
        if (player !== "indefinido" && player !== undefined) return; 
        setDibujando(true);
        const pos = obtenerCoordenadas(evt);
        setPuntos([pos]);
    };

    const evtTerminaDibujo = () => {
        if (player !== "indefinido" && player !== undefined) return;
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
            canvas.width = 600;
            canvas.height = 400;
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
                cursor: player === "indefinido" || player === undefined ? 'crosshair' : 'not-allowed',
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