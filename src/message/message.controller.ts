import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

   @Post('send')
   async sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<Message> {
     // Pass the entire DTO to the service
     return this.messageService.sendMessage(sendMessageDto);
   }

  @Get(':conversationId')
  async getMessages(@Param('conversationId') conversationId: number): Promise<Message[]> {
    return this.messageService.getMessages(conversationId);
  }
}
