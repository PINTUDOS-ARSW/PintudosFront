import "./Wait.css";
export default function Wait(props: ModalProps) {
    if (props.show3) {
        return (
            <div className="background3">
                <div className="window3">
                    <div className="title3">Unirse a una partida</div>
                    <div className="message3">Ya estas dentro</div>
                    <div className="message4">Esperando a otros jugadores</div>
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
    } else {
        return null;
    }
}
interface ModalProps {
    show3: boolean;
    setShow3(show: boolean): void;
}