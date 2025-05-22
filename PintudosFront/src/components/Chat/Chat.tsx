import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../useWebSocket";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

export default function Chat({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}) {
  const { sendMessage, connected, subscribeToChat, waitForConnection } = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [winner, setWinner] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!roomId || isSubscribed) return;
    
    // Usar waitForConnection para asegurar que la conexión está lista
    waitForConnection(() => {
      try {
        console.log("💬 Suscribiéndose al chat para la sala:", roomId);
        
        const subscription = subscribeToChat(roomId, (msg) => {
          console.log("📨 Mensaje recibido:", msg);
          
          if (msg.message === "REDIRECT_HOME") {
            navigate("/");
          } else if (msg.sender === "System" && msg.message.includes("ganó")) {
            setWinner(msg.message);
          } else {
            setMessages((prev) => [...prev, msg]);
          }
        });
        
        setIsSubscribed(true);
        console.log("✅ Suscripción al chat completada");
        
        // Importante: retornar una función de limpieza para el efecto
        return () => {
          if (subscription && typeof subscription.unsubscribe === 'function') {
            subscription.unsubscribe();
          }
        };
      } catch (error) {
        console.error("❌ Error al suscribirse al chat:", error);
      }
    });
  }, [roomId, waitForConnection, subscribeToChat, navigate, isSubscribed]);

  const sendChatMessage = () => {
    if (message.trim() !== "") {
      // Usar waitForConnection para enviar el mensaje
      waitForConnection(() => {
        sendMessage(roomId, message, "chat", username);
      });
      setMessage("");
    }
  };

  // Manejar la tecla Enter para enviar mensajes
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendChatMessage();
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
                setWinner(null);
                navigate("/");
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div className="chat-box">
        {messages.length === 0 ? (
          <div className="empty-chat">No hay mensajes aún. ¡Sé el primero en escribir!</div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chat-message ${msg.sender === username ? 'own-message' : ''}`}
            >
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))
        )}
      </div>

      {/* Input y botón */}
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendChatMessage}>Enviar</button>
      </div>

      {!connected && (
        <div className="connection-status">
          Conectando al servidor...
        </div>
      )}
    </div>
  );
}