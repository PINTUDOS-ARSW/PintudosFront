import "./Modal2.css";

export default function Modal2(props: ModalProps) {
    if (props.show2) {
        return (
            <div className="background1">
                <div className="window1">
                    <div className="title1">Crear partida</div>
                    <div className="message1">Codigo de partida</div>
                    <div className="numeros1">123456</div>
                    <div className="button1">
                        <button className="button-close1" onClick={() => props.setShow2(false)}>
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
