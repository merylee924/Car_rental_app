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

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Stocker les utilisateurs connectés et leur rôle
  private clients: Record<string, { id: string; role: string }> = {}; // socket.id -> { id, role }

  // Gère la connexion des clients
  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  // Gère la déconnexion des clients
  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
    delete this.clients[client.id];
  }

  // Enregistre un utilisateur avec un rôle (client ou loueur)
  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { id: string; role: string },
    @ConnectedSocket() client: Socket,
  ): void {
    this.clients[client.id] = data;
    console.log(`Registered: ${client.id} as ${data.role}`);
  }

  // Gère les messages entre les clients
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { toRole: string; text: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const sender = this.clients[client.id];
    if (!sender) {
      console.error(`Unknown sender: ${client.id}`);
      return;
    }

    // Trouve un destinataire correspondant au rôle spécifié
    const recipientId = Object.keys(this.clients).find(
      (key) => this.clients[key].role === data.toRole && key !== client.id,
    );

    if (recipientId) {
      this.server.to(recipientId).emit('message', {
        from: sender.role,
        text: data.text,
      });
    } else {
      client.emit('error', { message: `No ${data.toRole} connected.` });
    }
  }
}
