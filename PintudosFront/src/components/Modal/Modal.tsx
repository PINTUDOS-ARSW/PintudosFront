import "./Modal.css";   
import Wait from '../Wait/Wait'; 
import React from 'react';

export default function Modal(props: ModalProps) {
    const [show3, setShow3] = React.useState(false);
    if (props.show) {
        return (
            <div className="background">
                <div className="window">
                    <div className="title">Unirse a una partida</div>
                    <div className="message">Codigo de partida</div>
                    <div className="button">
                        <div className="input-container">
                            <input type="text" className="input" placeholder="" />
                            <button className="button-join" onClick={() => setShow3(true)}>Unirse</button>
                            {show3 && <Wait show3={show3} setShow3={setShow3} />}
                        </div>
                        {!show3 &&(
                        <button className="button-close" onClick={() => props.setShow(false)}>
                            Cerrar
                        </button>
                        )}
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}

interface ModalProps {
    show: boolean;
    setShow(show: boolean): void;
}
