import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Player {
  id: string;
  username: string;
  isHost: boolean;
  score: number;
}

interface Room {
  players: Player[];
}

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private rooms = new Map<string, Room>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    for (const [roomCode, room] of this.rooms) {
      const playerIndex = room.players.findIndex((player) => player.id === client.id);
      if (playerIndex !== -1) {
        const [removedPlayer] = room.players.splice(playerIndex, 1);
        this.server.to(roomCode).emit('playerLeft', { id: client.id, username: removedPlayer.username });

        if (room.players.length === 0) {
          this.rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted`);
        } else if (removedPlayer.isHost) {
          room.players[0].isHost = true; // Promote the next player as the host
          this.server.to(roomCode).emit('playerUpdate', room.players);
        }
        break;
      }
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; username: string },
  ) {
    const { roomCode, username } = data;

    if (!this.rooms.has(roomCode)) {
      this.rooms.set(roomCode, { players: [] });
    }

    const room = this.rooms.get(roomCode);
    const newPlayer: Player = { id: client.id, username, isHost: room.players.length === 0, score: 0 };
    room.players.push(newPlayer);

    client.join(roomCode);

    this.server.to(roomCode).emit('playerJoined', newPlayer);
    this.server.to(roomCode).emit('playerUpdate', room.players);

    console.log(`Player ${username} joined room ${roomCode}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; username: string },
  ) {
    const { roomCode, username } = data;

    const room = this.rooms.get(roomCode);
    if (room) {
      const playerIndex = room.players.findIndex((player) => player.id === client.id);

      if (playerIndex !== -1) {
        const [removedPlayer] = room.players.splice(playerIndex, 1);

        this.server.to(roomCode).emit('playerLeft', { id: client.id, username });

        if (room.players.length === 0) {
          this.rooms.delete(roomCode);
        } else if (removedPlayer.isHost) {
          room.players[0].isHost = true;
        }

        this.server.to(roomCode).emit('playerUpdate', room.players);
      }

      client.leave(roomCode);
    }
  }

  @SubscribeMessage('startGame')
  handleStartGame(@MessageBody() data: { roomCode: string }) {
    const { roomCode } = data;

    const room = this.rooms.get(roomCode);
    if (room) {
      this.server.to(roomCode).emit('startGame', {});
      console.log(`Game started in room ${roomCode}`);
    }
  }
}