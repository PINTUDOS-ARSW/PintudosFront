// src/components/Chat.tsx
import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../useWebSocket";
import "./Chat.css";

export default function Chat({
  roomId,
  username, // <- NUEVO
}: {
  roomId: string;
  username: string;
}) {
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
  
    console.log("📩 Suscrito al chat en room:", roomId);
  
    // Cleanup: cancelar suscripción
    return () => {
      subscription?.unsubscribe();
      console.log("🧹 Cancelada suscripción al chat de", roomId);
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
