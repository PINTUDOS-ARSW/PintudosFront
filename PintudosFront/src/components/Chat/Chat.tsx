import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../../useWebSocket";
import { useNavigate } from "react-router-dom";

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
    { sender: string; message: string; timestamp?: string }[]
  >([]);
  const [winner, setWinner] = useState<string | null>(null);
  const navigate = useNavigate();
  const subscriptionRef = useRef<any>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll cuando se reciben nuevos mensajes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Efecto para suscribirse al chat - CORREGIDO
  useEffect(() => {
    if (!roomId) return;
    
    // Limpiar suscripción anterior si existe
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    
    // Suscribirse solo cuando la conexión esté lista
    waitForConnection(() => {
      try {
        console.log("💬 Suscribiéndose al chat para la sala:", roomId);
        
        // Guardar la referencia de la suscripción
        subscriptionRef.current = subscribeToChat(roomId, (msg) => {
          console.log("📨 Mensaje recibido:", msg);
          
          if (msg.message === "REDIRECT_HOME") {
            navigate("/");
          } else if (msg.sender === "System" && msg.message.includes("ganó")) {
            setWinner(msg.message);
          } else {
            // Usar una función para actualizar el estado que compara con los mensajes existentes
            setMessages(prevMessages => {
              // Si el mensaje ya existe (verificando por contenido y timestamp), no lo añadas
              const messageExists = prevMessages.some(existingMsg => 
                existingMsg.sender === msg.sender && 
                existingMsg.message === msg.message && 
                existingMsg.timestamp === msg.timestamp
              );
              
              if (messageExists) {
                return prevMessages;
              } else {
                return [...prevMessages, msg];
              }
            });
          }
        });
        
        console.log("✅ Suscripción al chat completada");
      } catch (error) {
        console.error("❌ Error al suscribirse al chat:", error);
      }
    });
    
    // Limpiar suscripción al desmontar
    return () => {
      if (subscriptionRef.current) {
        console.log("🔄 Limpiando suscripción al chat");
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [roomId, waitForConnection, subscribeToChat, navigate]);

  const sendChatMessage = () => {
    if (message.trim() !== "") {
      // Usar waitForConnection para asegurar que el mensaje se envía cuando la conexión está lista
      waitForConnection(() => {
        console.log(`🚀 Enviando mensaje al tópico /app/chat/${roomId}:`, message);
        
        // El objeto que enviamos debe coincidir con la clase ChatMessage en el backend
        const chatMessage = {
          sender: username,
          message: message
        };
        
        // El tercer parámetro debe ser "chat" para que se enrute correctamente
        sendMessage(roomId, message, "chat", username);
        setMessage("");
      });
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
      <div 
        className="chat-box" 
        ref={messagesContainerRef}
      >
        {messages.length === 0 ? (
          <div className="empty-chat">No hay mensajes aún. ¡Sé el primero en escribir!</div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chat-message ${msg.sender === username ? 'own-message' : ''} ${msg.sender === 'System' ? 'system-message' : ''}`}
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
          disabled={!connected}
        />
        <button 
          onClick={sendChatMessage}
          disabled={!connected || message.trim() === ""}
        >
          Enviar
        </button>
      </div>

      {!connected && (
        <div className="connection-status">
          Conectando al servidor...
        </div>
      )}
    </div>
  );
}