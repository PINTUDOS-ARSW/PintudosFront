import "./Modal.css";

export default function Modal(props: ModalProps) {
    if (props.show) {
        return (
            <div className="background">
                <div className="window">
                    <div className="title">Unirse a una partida</div>
                    <div className="message">mensaje</div>
                    <div className="button">
                        <button className="button-close" onClick={() => props.setShow(false)}>
                            cerrar
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
