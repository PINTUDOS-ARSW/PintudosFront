// src/components/Chat.tsx
import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../useWebSocket";
import "./Chat.css";

type ChatMessage = {
  sender: string;
  message: string;
  timestamp?: string;
};

export default function Chat({ roomId }: { roomId: string }) {
  const { sendMessage, connected, subscribeToChat } = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>

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
