import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  interface Player {
    username: string;
    isHost: boolean;
  }
  
  interface Room {
    players: Player[];
  }
  
  @WebSocketGateway({ cors: true })
  export class GameGateway {
    @WebSocketServer()
    server: Server;
  
    private rooms = new Map<string, Room>();
  
    @SubscribeMessage('joinRoom')
    handleJoinRoom(
      @MessageBody() data: { roomCode: string; username: string },
      @ConnectedSocket() client: Socket,
    ) {
      const { roomCode, username } = data;
  
      if (!this.rooms.has(roomCode)) {
        this.rooms.set(roomCode, { players: [] });
      }
  
      const room = this.rooms.get(roomCode);
      const isHost = room.players.length === 0; // First player is the host
      room.players.push({ username, isHost });
  
      client.join(roomCode); // Add the client to the room
      this.server.to(roomCode).emit('updatePlayers', room.players); // Notify all players
    }
  
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(
      @MessageBody() data: { roomCode: string; username: string },
      @ConnectedSocket() client: Socket,
    ) {
      const { roomCode, username } = data;
  
      const room = this.rooms.get(roomCode);
      if (room) {
        room.players = room.players.filter((player) => player.username !== username);
        this.server.to(roomCode).emit('updatePlayers', room.players); // Notify all players
        if (room.players.length === 0) {
          this.rooms.delete(roomCode); // Delete the room if no players are left
        }
      }
  
      client.leave(roomCode); // Remove the client from the room
    }
  }
  