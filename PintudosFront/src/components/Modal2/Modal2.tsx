import "./Modal2.css";

export default function Modal2(props: ModalProps) {
    if (props.show2) {
        return (
            <div className="background">
                <div className="window">
                    <div className="title">Crear partida</div>
                    <div className="message">Codigo de partida</div>
                    <div className="numeros">123456</div>
                    <div className="button">
                        <button className="button-close" onClick={() => props.setShow2(false)}>
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
    show2: boolean;
    setShow2(show: boolean): void;
}
