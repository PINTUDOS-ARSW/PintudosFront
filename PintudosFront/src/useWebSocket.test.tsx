// src/__tests__/useWebSocket.test.tsx
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { WebSocketProvider, useWebSocket } from "./useWebSocket"; // Ajusta ruta si es necesario
import { Client } from "@stomp/stompjs";

jest.mock("@stomp/stompjs", () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        activate: jest.fn(),
        deactivate: jest.fn(),
        publish: jest.fn(),
        subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
        active: true,

        // Simulamos las funciones callback que espera el hook
        onConnect: null,
        onDisconnect: null,
        onStompError: null,
        onWebSocketError: null,

        // Se usan setters para poder asignar callbacks
        set onConnect(cb: Function) {
          this._onConnect = cb;
        },
        get onConnect() {
          return this._onConnect;
        },
        _onConnect: jest.fn(),

        set onDisconnect(cb: Function) {
          this._onDisconnect = cb;
        },
        get onDisconnect() {
          return this._onDisconnect;
        },
        _onDisconnect: jest.fn(),
      };
    }),
  };
});

jest.mock("sockjs-client", () => jest.fn());

describe("useWebSocket hook", () => {
  it("inicia con connected false y cambia a true en onConnect", () => {
    const wrapper: React.FC = ({ children }) => (
      <WebSocketProvider>{children}</WebSocketProvider>
    );

    const { result } = renderHook(() => useWebSocket(), { wrapper });

    expect(result.current.connected).toBe(false);

    act(() => {
      const clientInstance = (Client as jest.Mock).mock.results[0].value;
      // Simular la llamada al callback onConnect que el hook asigna
      if (clientInstance._onConnect) clientInstance._onConnect();
    });

    expect(result.current.connected).toBe(true);
  });

  it("llama a createRoom, joinRoom, sendMessage y subscribe", () => {
    const wrapper: React.FC = ({ children }) => (
      <WebSocketProvider>{children}</WebSocketProvider>
    );
    const { result } = renderHook(() => useWebSocket(), { wrapper });

    act(() => {
      const clientInstance = (Client as jest.Mock).mock.results[0].value;
      if (clientInstance._onConnect) clientInstance._onConnect();
    });

    act(() => {
      result.current.createRoom("room1", "player1");
      result.current.joinRoom("room1", "player1");
      result.current.sendMessage("room1", "mensaje", "chat", "player1");
    });

    const clientInstance = (Client as jest.Mock).mock.results[0].value;

    expect(clientInstance.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: "/app/createRoom",
        body: JSON.stringify({ roomId: "room1", player: "player1" }),
      })
    );

    expect(clientInstance.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: "/app/joinRoom",
        body: JSON.stringify({ roomId: "room1", player: "player1" }),
      })
    );

    expect(clientInstance.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: "/app/chat/room1",
        body: JSON.stringify({ sender: "player1", message: "mensaje" }),
      })
    );

    const callback = jest.fn();

    act(() => {
      result.current.subscribeToChat("room1", callback);
    });
    expect(clientInstance.subscribe).toHaveBeenCalledWith(
      "/topic/chat/room1",
      expect.any(Function)
    );

    act(() => {
      result.current.subscribeToTraces("room1", callback);
    });
    expect(clientInstance.subscribe).toHaveBeenCalledWith(
      "/topic/room1/traces",
      expect.any(Function)
    );
  });
});
