import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private players = {}; // Store connected players
  private host = null; // Track the host

  handleConnection(client: Socket) {
    console.log(`Player connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Player disconnected: ${client.id}`);
    delete this.players[client.id];
    if (this.host === client.id) this.host = null;
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(@MessageBody() { name }: { name: string }, @ConnectedSocket() client: Socket) {
    if (!this.host) {
      this.host = client.id; // Assign the first player as the host
      client.emit('hostAssigned', { message: 'You are the host!' });
    }
    this.players[client.id] = { id: client.id, name, score: 0 };
    client.emit('playerJoined', { players: this.players, host: this.host });
    client.broadcast.emit('playerJoined', { players: this.players, host: this.host });
  }
  @SubscribeMessage('updateScore')
  handleUpdateScore(
    @MessageBody() { playerId, score }: { playerId: string; score: number },
    @ConnectedSocket() client: Socket, // Use the connected socket instance
  ) {
    if (this.players[playerId]) {
      this.players[playerId].score += score;
      const updatedPlayer = this.players[playerId];

      // Notify the client who updated their score
      client.emit('scoreUpdated', { player: updatedPlayer });

      // Broadcast to all other clients
      client.broadcast.emit('scoreUpdated', { player: updatedPlayer });
    }
  }

}
