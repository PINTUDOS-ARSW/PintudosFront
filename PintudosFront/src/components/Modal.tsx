import styled from "styled-components";


const Background = styled.div`
background-color: rgba(15, 25, 25, 0.75);
position: fixed;
top: 0;
left: 0;
height: 100vh;
width: 100vw;
display: flex;
justify-content: center;
align-items: center;
`;

const Window = styled.div`
background-color: white;
border: 0.2em solid black;
border-radius: 2em;
height: 12em;
width: 32em;
display: flex;
flex-direction: column;
`;
const Title = styled.div`
height: 3em;
background-color: #252525;
color: white;
font-size: 1.2em;
font-weight: bold;
font-style: italic;
display: flex;
justify-content: center;
align-items: center;
border-top-left-radius: 1.5em;
border-top-right-radius: 1.5em;
`;
const Message = styled.div`
flex: 1;
display: flex;
justify-content: left;
align-items: start;
padding: 0.3em;
color: black;
`;
const Button = styled.div`
height: 3em;
display: flex;
justify-content: center;
align-items: center;
`;

const ButtonClose = styled.button`
background-color: #252525;
color: white;
`;

export default  function Modal(props: ModalProps) {
    if (props.show) {
        return (
            <Background>
                <Window>
                <Title>Unirse a una partida</Title>
                <Message>mensaje</Message>
                <Button>
                    <ButtonClose onClick={() => props.setShow(false)}>cerrar</ButtonClose>
                </Button>
                </Window>
            </Background>
        );
    } else {
        return <></>;
    }
}

interface ModalProps {
    show: boolean;
    setShow(show: boolean): void;

}
