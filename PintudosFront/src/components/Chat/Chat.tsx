// src/components/Chat.tsx
import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../useWebSocket";

export default function Chat({ roomId }: { roomId: string }) {
  const { sendMessage, connected, subscribeToChat } = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!connected) return;

    subscribeToChat(roomId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    console.log("📩 Suscrito al chat en room:", roomId);
  }, [connected, roomId, subscribeToChat]);

  const sendChatMessage = () => {
    if (message.trim() !== "") {
      sendMessage(roomId, message, "chat");
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
      />
      <button onClick={sendChatMessage}>Enviar</button>
    </div>
  );
}
