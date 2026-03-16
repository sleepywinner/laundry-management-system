import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = (userId: string): void => {
  const socket = getSocket();
  socket.connect();
  socket.emit("join", userId);
  console.log("⚡ Socket connected for user:", userId);
};

export const disconnectSocket = (): void => {
  const socket = getSocket();
  socket.disconnect();
  console.log("❌ Socket disconnected");
};
