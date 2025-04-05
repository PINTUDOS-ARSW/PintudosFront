// src/components/Chat.tsx
import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../useWebSocket";
import "./Chat.css";
import Ganador from "../Ganar/Ganador";

export default function Chat({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}) {
  const [show5, setShow5] = React.useState(true);
  const { sendMessage, connected, subscribeToChat } = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  useEffect(() => {
    if (!connected) return;

    const subscription = subscribeToChat(roomId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [connected, roomId, subscribeToChat]);

  const sendChatMessage = () => {
    if (message.trim() !== "") {
      sendMessage(roomId, message, "chat", username); // <- AÑADIDO username
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
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