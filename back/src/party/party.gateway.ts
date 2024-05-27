import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080, {
  cors: true,
  namespace: 'party',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinParty')
  handleJoinRoom(
    @MessageBody() partyId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    if (this.getRoomOfClient(client)) {
      return;
    }
    client.join(partyId);

    this.server.in(partyId).emit('newMemberJoined', client.id);
  }

  @SubscribeMessage('leaveParty')
  handleLeaveRoom(
    @MessageBody() partyId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('memberLeave', client.id);
  }

  private getRoomOfClient(client: Socket): string | null {
    const rooms = Array.from(client.rooms);

    return rooms.length > 1 ? rooms[1] : null;
  }
}
