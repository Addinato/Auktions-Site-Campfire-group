import { Server as IOServer } from 'socket.io';
import http from 'http';

let io: IOServer | null = null;

export function initSocket(server: http.Server) {
  if (!io) {
    io = new IOServer(server, {
      cors: {
        origin: '*',
      },
    });
  }
  return io;
}

export function getIo() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io as IOServer;
}