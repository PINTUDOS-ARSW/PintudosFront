import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wait.css";

export default function Wait(props: ModalProps) {
    const [jugadores, setJugadores] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const intervalo = setInterval(() => {
            setJugadores(prev => {
                if (prev < 3) return prev + 1;
                clearInterval(intervalo);
                return prev;
            });
        }, 1500);

        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        if (jugadores >= 3) {
            // Redirige a /juego luego de 1 segundo
            setTimeout(() => {
                navigate("/juego");
            }, 1000);
        }
    }, [jugadores, navigate]);

    if (!props.show3) return null;

    return (
        <div className="background3">
            <div className="window3">
                <div className="title3">Unirse a una partida</div>
                <div className="message3">Ya estás dentro</div>
                <div className="message4">Esperando a otros jugadores...</div>
                <p style={{ marginTop: '10px', color: '#fff' }}>Jugadores conectados: {jugadores}</p>
                <div className="pendulum">
                    <div className="pendulum_box">
                        <div className="ball first"></div>
                        <div className="ball"></div>
                        <div className="ball"></div>
                        <div className="ball"></div>
                        <div className="ball last"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ModalProps {
    show3: boolean;
    setShow3(show: boolean): void;
}
