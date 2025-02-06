import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Socket } from 'socket.io';
import { Message } from './message.entity';
import { SendMessageDto } from './dto/send-message.dto'; // Correct import

@WebSocketGateway()
export class MessageGateway {
  constructor(private readonly messageService: MessageService) {}  // ✅ Injection correcte

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { senderId: number; receiverId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { senderId, receiverId, content } = data;

    // Create the SendMessageDto object
    const sendMessageDto: SendMessageDto = {
      senderId,
      receiverId,
      content,
    };

    // Send the message via the service
    const message: Message = await this.messageService.sendMessage(sendMessageDto);

    // Emit the message to the recipient
    client.to(receiverId.toString()).emit('newMessage', message);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(@MessageBody() data: { conversationId: number }, @ConnectedSocket() client: Socket) {
    const { conversationId } = data;
    client.join(conversationId.toString());
  }
}
