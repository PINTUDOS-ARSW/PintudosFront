// src/useWebSocket.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type WebSocketContextType = {
  createRoom: (roomId: string) => void;
  joinRoom: (roomId: string, player: string) => void;
  sendMessage: (roomId: string, message: string) => void;
  connected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/game");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Conectado a STOMP");
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("❌ Desconectado de STOMP");
        setConnected(false);
      },
      debug: (msg) => {
        // console.log("STOMP: ", msg); // Descomenta si necesitas debug
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const createRoom = (roomId: string) => {
    if (connected && clientRef.current) {
      clientRef.current.publish({
        destination: "/app/createRoom",
        body: roomId,
      });
    }
  };

  const joinRoom = (roomId: string, player: string) => {
    if (connected && clientRef.current) {
      clientRef.current.publish({
        destination: "/app/joinRoom",
        body: JSON.stringify({ roomId, player }),
      });
    }
  };

  const sendMessage = (roomId: string, message: string) => {
    if (connected && clientRef.current) {
      clientRef.current.publish({
        destination: `/app/trace/${roomId}`,
        body: JSON.stringify({ roomId, message }),
      });
    }
  };

  return (
    <WebSocketContext.Provider value={{ createRoom, joinRoom, sendMessage, connected }}>
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
