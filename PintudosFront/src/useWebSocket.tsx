import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type WebSocketContextType = {
  createRoom: (roomId: string, player: string) => void;
  joinRoom: (roomId: string, player: string) => void;
  sendMessage: (roomId: string, message: string, type?: "chat" | "trace") => void;
  subscribeToChat: (roomId: string, callback: (msg: string) => void) => void;
  subscribeToTraces: (roomId: string, callback: (trace: any) => void) => void;
  connected: boolean;
};


const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://18.234.188.123:8080/game"),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("✅ Conectado a STOMP");
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("❌ Desconectado de STOMP");
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  const createRoom = (roomId: string, player: string) => {
    clientRef.current?.publish({
      destination: "/app/createRoom",
      body: JSON.stringify({ roomId, player}),
    });
  };

  const joinRoom = (roomId: string, player: string) => {
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
  
  const subscribeToPlayerCount = (roomId: string, callback: (count: number) => void) => {
    clientRef.current?.subscribe(`/topic/room/${roomId}/players`, (msg: IMessage) => {
      const data = JSON.parse(msg.body);
      callback(data.players);
      console.log("🧪 Recibido conteo de jugadores:", data);
    });
  };
  
  const subscribeToChat = (roomId: string, callback: (msg: ChatMessage) => void) => {
    return clientRef.current?.subscribe(`/topic/chat/${roomId}`, (msg: IMessage) => {
      const data = JSON.parse(msg.body);
      callback(data);
    });
  };

  const subscribeToTraces = (roomId: string, callback: (trace: any) => void) => {
    clientRef.current?.subscribe(`/topic/${roomId}/traces`, (message: IMessage) => {
      const trace = JSON.parse(message.body);
      callback(trace);
    });
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
