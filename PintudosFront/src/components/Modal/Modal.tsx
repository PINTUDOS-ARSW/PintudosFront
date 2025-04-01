import "./Modal.css";

export default function Modal(props: ModalProps) {
    if (props.show) {
        return (
            <div className="background">
                <div className="window">
                    <div className="title">Unirse a una partida</div>
                    <div className="message">Codigo de partida</div>
                    <div className="button">
                        <div className="input-container">
                            <input type="text" className="input" placeholder="" />
                            <button className="button-join">Unirse</button>
                        </div>
                        <button className="button-close" onClick={() => props.setShow(false)}>
                            Cerrar
                        </button>
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
