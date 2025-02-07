import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../users/entities/user.entity';
import { Message } from '../message/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Server } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
@Injectable()
export class ConversationService {
  @WebSocketServer()
  private server: Server;

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createConversation(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const { userId, ownerId } = createConversationDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });

    if (!user || !owner) {
      throw new NotFoundException('User or owner not found');
    }

    const conversation = this.conversationRepository.create({ user, owner });
    const savedConversation = await this.conversationRepository.save(conversation);

    this.server.emit('conversationCreated', savedConversation);

    return savedConversation;
  }

  async getConversation(id: number): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['user', 'owner', 'messages'],
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  async getUserConversations(userId: number) {
    const conversations = await this.conversationRepository.find({
      where: [{ user: { id: userId } }, { owner: { id: userId } }],
      relations: ['user', 'owner', 'messages'],
    });

    return conversations.map((conversation) => {
      const otherPerson = conversation.user.id === userId ? conversation.owner : conversation.user;

      return {
        id: conversation.id,
        user: {
          id: otherPerson.id,
          firstName: otherPerson.firstName,
          lastName: otherPerson.lastName,
          picture: otherPerson.picture,
        },
        messages: conversation.messages,
      };
    });
  }

  async findConversationBetweenUsers(userId1: number, userId2: number): Promise<Conversation | null> {
    return this.conversationRepository.findOne({
      where: [
        { user: { id: userId1 }, owner: { id: userId2 } },
        { user: { id: userId2 }, owner: { id: userId1 } },
      ],
      relations: ['user', 'owner', 'messages'],
    });
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['conversation', 'sender'],
    });
  }

}
