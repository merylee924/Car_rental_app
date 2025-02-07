import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/entities/user.entity';
import { Conversation } from '../conversation/conversation.entity';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

async sendMessage(sendMessageDto: SendMessageDto): Promise<Message> {
  const { senderId, receiverId, content } = sendMessageDto;

  // Récupérer les utilisateurs en fonction des IDs
  const sender = await this.userRepository.findOne({ where: { id: senderId } });
  const receiver = await this.userRepository.findOne({ where: { id: receiverId } });

  if (!sender || !receiver) {
    throw new NotFoundException('Sender or Receiver not found');
  }

  // Générer une clé unique pour la conversation
  const conversationKey = [senderId, receiverId].sort().join('_');

  // Vérifier si la conversation existe déjà
  let conversation = await this.conversationRepository.findOne({
    where: { conversationKey },
    relations: ['user', 'owner'], // Inclure les relations pour vérifier les participants
  });

  // Si la conversation n'existe pas, la créer
  if (!conversation) {
    conversation = this.conversationRepository.create({
      conversationKey,
      user: sender,
      owner: receiver,
    });
    await this.conversationRepository.save(conversation);
  }

  // Créer le message avec le sender et le receiver spécifiés
  const message = this.messageRepository.create({
    content,
    sender, // Expéditeur
    receiver, // Destinataire
    conversation,
  });

  // Sauvegarder et retourner le message
  return this.messageRepository.save(message);
}

 async getMessages(conversationId: number): Promise<Message[]> {
   return this.messageRepository.find({
     where: { conversation: { id: conversationId } },
     order: { createdAt: 'ASC' }, // Tri des messages par date de création croissante
   });
 }
async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
  // Générer la clé unique de conversation
  const conversationKey = [userId1, userId2].sort().join('_');

  // Rechercher la conversation correspondant aux deux utilisateurs
  const conversation = await this.conversationRepository.findOne({
    where: { conversationKey },
  });

  if (!conversation) {
    throw new NotFoundException(`No conversation found between user ${userId1} and user ${userId2}`);
  }

  // Récupérer les messages associés à cette conversation
  return this.messageRepository.find({
    where: { conversation: { id: conversation.id } },
    order: { createdAt: 'ASC' }, // Tri par ordre chronologique
    relations: ['sender', 'receiver'], // Inclure les informations des expéditeurs et destinataires
  });
}


}
