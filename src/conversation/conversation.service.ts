import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../users/entities/user.entity';
import { Message } from '../message/message.entity'; // Ajout de l'import de Message
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>, // Ajout pour éviter les erreurs
  ) {}

  // Créer une nouvelle conversation entre un utilisateur et un propriétaire
  async createConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const { userId, ownerId } = createConversationDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });

    if (!user || !owner) {
      throw new NotFoundException('User or owner not found');
    }

    const conversation = new Conversation();
    conversation.user = user;
    conversation.owner = owner;

    return this.conversationRepository.save(conversation);
  }

  // Récupérer une conversation par ID
  async getConversation(id: number): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['user', 'owner', 'messages'], // Charger les messages associés
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  // Récupérer toutes les conversations d'un utilisateur
  async getUserConversations(userId: number): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: [{ user: { id: userId } }, { owner: { id: userId } }],
      relations: ['user', 'owner', 'messages'], // Charger les messages associés
    });
  }

  // Récupérer une conversation entre deux utilisateurs
  async findConversationBetweenUsers(userId1: number, userId2: number): Promise<Conversation | null> {
    return this.conversationRepository.findOne({
      where: [
        { user: { id: userId1 }, owner: { id: userId2 } },
        { user: { id: userId2 }, owner: { id: userId1 } },
      ],
      relations: ['user', 'owner', 'messages'], // Charger les messages associés
    });
  }

  // Récupérer tous les messages d'une conversation (Ajout pour éviter l'erreur TS)
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['conversation', 'sender'], // Charger l'expéditeur et la conversation
    });
  }
}
