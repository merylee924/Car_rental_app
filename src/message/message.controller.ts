import { Controller, Post, Body, Param, Get, NotFoundException } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<Message> {
    return this.messageService.sendMessage(sendMessageDto);
  }

  @Get(':conversationId')
  async getMessages(@Param('conversationId') conversationId: number): Promise<Message[]> {
    return this.messageService.getMessages(conversationId);
  }

  @Get('between/:userId1/:userId2')
  async getMessagesBetweenUsers(
    @Param('userId1') userId1: number,
    @Param('userId2') userId2: number,
  ): Promise<Message[]> {
    const messages = await this.messageService.getMessagesBetweenUsers(userId1, userId2);

    if (!messages || messages.length === 0) {
      throw new NotFoundException(`No messages found between user ${userId1} and user ${userId2}`);
    }
    return messages;
  }
}
