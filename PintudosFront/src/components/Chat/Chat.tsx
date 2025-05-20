import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../useWebSocket";
import { useNavigate } from "react-router-dom"; // Para redirigir
import "./Chat.css";

export default function Chat({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}) {
  const { sendMessage, connected, subscribeToChat } = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [winner, setWinner] = useState<string | null>(null); // Para mostrar el modal
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    if (!connected) return;

    const subscription = subscribeToChat(roomId, (msg) => {
      if (msg.message === "REDIRECT_HOME") {
        navigate("/"); // Redirigir al home
      } else if (msg.sender === "System" && msg.message.includes("ganó")) {
        setWinner(msg.message); // Mostrar el modal con el ganador
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [connected, roomId, subscribeToChat, navigate]);

  const sendChatMessage = () => {
    if (message.trim() !== "") {
      sendMessage(roomId, message, "chat", username);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      {/* Modal para mostrar el ganador */}
      {winner && (
        <div className="modal">
          <div className="modal-content">
            <p>{winner}</p>
            <button
              onClick={() => {
                setWinner(null); // Cierra el modal
                navigate("/"); // Redirige al home
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>

      {/* Input y botón */}
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendChatMessage}>Enviar</button>
      </div>
    </div>
  );
}