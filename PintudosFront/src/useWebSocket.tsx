import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type WebSocketContextType = {
  createRoom: (roomId: string, player: string) => void;
  joinRoom: (roomId: string, player: string) => void;
  sendMessage: (
    roomId: string,
    message: string,
    type?: "chat" | "trace"
  ) => void;
  subscribeToChat: (roomId: string, callback: (msg: any) => void) => void | null;
  subscribeToTraces: (roomId: string, callback: (trace: any) => void) => void | null;
  connected: boolean;
  waitForConnection: (callback: () => void) => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const connectionCallbacksRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    const API_BASE_URL = "https://api.arswpintudos.com";

    fetch(`${API_BASE_URL}/game?continue`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        console.log("✅ Pre-autenticación completada:", response.status);
        initializeWebSocket();
      })
      .catch((error) => {
        console.error("❌ Error en pre-autenticación:", error);
      });
      
    function initializeWebSocket() {
      const client = new Client({
        webSocketFactory: () => new SockJS(`${API_BASE_URL}/game`),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("✅ Conectado a STOMP");
          setConnected(true);
          
          // Ejecutar todas las callbacks pendientes
          connectionCallbacksRef.current.forEach(callback => callback());
          connectionCallbacksRef.current = [];
        },
        onDisconnect: () => {
          console.log("❌ Desconectado de STOMP");
          setConnected(false);
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame);
        },
        onWebSocketError: (event) => {
          console.error("WebSocket error:", event);
        },
      });

      client.activate();
      clientRef.current = client;
    }

    return () => {
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  // Función para esperar a que la conexión esté lista
  const waitForConnection = (callback: () => void) => {
    if (connected && clientRef.current?.active) {
      callback();
    } else {
      connectionCallbacksRef.current.push(callback);
    }
  };

  const createRoom = (roomId: string, player: string = "Anfitrión") => {
    if (!connected) {
      waitForConnection(() => createRoom(roomId, player));
      return;
    }
    
    clientRef.current?.publish({
      destination: "/app/createRoom",
      body: JSON.stringify({ roomId, player }),
    });
  };

  const joinRoom = (roomId: string, player: string) => {
    if (!connected) {
      waitForConnection(() => joinRoom(roomId, player));
      return;
    }
    
    clientRef.current?.publish({
      destination: "/app/joinRoom",
      body: JSON.stringify({ roomId, player }),
    });
  };

  const sendMessage = (
    roomId: string,
    message: string,
    type: "chat" | "trace" = "trace",
    sender?: string
  ) => {
    if (!connected) {
      waitForConnection(() => sendMessage(roomId, message, type, sender));
      return;
    }
    
    const destination =
      type === "chat" ? `/app/chat/${roomId}` : `/app/trace/${roomId}`;

    let body;

    if (type === "chat") {
      body = JSON.stringify({
        sender: sender ?? "Anónimo",
        message: message,
      });
    } else {
      body = JSON.stringify(message);
    }

    clientRef.current?.publish({
      destination,
      body,
    });
  };

  const subscribeToPlayerCount = (
    roomId: string,
    callback: (count: number) => void
  ) => {
    if (!connected) {
      waitForConnection(() => subscribeToPlayerCount(roomId, callback));
      return null;
    }
    
    return clientRef.current?.subscribe(
      `/topic/room/${roomId}/players`,
      (msg: IMessage) => {
        const data = JSON.parse(msg.body);
        callback(data.players);
        console.log("🧪 Recibido conteo de jugadores:", data);
      }
    );
  };

  const subscribeToChat = (
    roomId: string,
    callback: (msg: any) => void
  ) => {
    if (!connected) {
      waitForConnection(() => subscribeToChat(roomId, callback));
      return null;
    }
    
    return clientRef.current?.subscribe(
      `/topic/chat/${roomId}`,
      (msg: IMessage) => {
        try {
          const data = JSON.parse(msg.body);
          callback(data);
        } catch (error) {
          console.error("Error parsing chat message:", error);
        }
      }
    );
  };

  const subscribeToTraces = (
    roomId: string,
    callback: (trace: any) => void
  ) => {
    if (!connected) {
      waitForConnection(() => subscribeToTraces(roomId, callback));
      return null;
    }
    
    return clientRef.current?.subscribe(
      `/topic/${roomId}/traces`,
      (message: IMessage) => {
        try {
          const trace = JSON.parse(message.body);
          callback(trace);
        } catch (error) {
          console.error("Error parsing trace:", error);
        }
      }
    );
  };

  return (
    <WebSocketContext.Provider
      value={{
        createRoom,
        joinRoom,
        sendMessage,
        subscribeToChat,
        subscribeToTraces,
        connected,
        subscribeToPlayerCount,
        waitForConnection,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket debe usarse dentro de WebSocketProvider");
  }
  return context;
};