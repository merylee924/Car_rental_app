import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Message } from '../message/message.entity';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  // Créer une nouvelle conversation
  @Post()
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    return this.conversationService.createConversation(createConversationDto);
  }

  // Récupérer une conversation par ID
  @Get(':id')
  async getConversation(@Param('id') id: number): Promise<Conversation> {
    return this.conversationService.getConversation(id);
  }

  // Récupérer toutes les conversations d'un utilisateur
  @Get('user/:userId')
  async getUserConversations(@Param('userId') userId: number): Promise<Conversation[]> {
    return this.conversationService.getUserConversations(userId);
  }
    @Get(':conversationId/messages')
    async getConversationMessages(@Param('conversationId') conversationId: number): Promise<Message[]> {
      return this.conversationService.getConversationMessages(conversationId);
    }

    @Get('between/:userId1/:userId2')
    async getConversationBetweenUsers(
      @Param('userId1') userId1: number,
      @Param('userId2') userId2: number
    ): Promise<Conversation | null> {
      return this.conversationService.findConversationBetweenUsers(userId1, userId2);
    }

}
