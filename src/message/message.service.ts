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

  async sendMessage(createMessageDto: SendMessageDto): Promise<Message> { // Changed to CreateMessageDto
    const { senderId, receiverId, content } = createMessageDto; // Adjusted to use CreateMessageDto

      const sender = await this.userRepository.findOne({ where: { id: senderId } });
       const receiver = await this.userRepository.findOne({ where: { id: receiverId } });


       if (!sender || !receiver) {
         throw new Error('Sender or Receiver not found');
       }
      let conversation = await this.conversationRepository.findOne({
          where: [
            { user: sender, owner: receiver },
            { user: receiver, owner: sender },
          ],
        });
      if (!conversation) {
          conversation = new Conversation();
          conversation.user = sender;
          conversation.owner = receiver;
          await this.conversationRepository.save(conversation);
        }
          const message = new Message();
            message.content = content;
            message.sender = sender;
            message.receiver = receiver;
            message.conversation = conversation;

            return this.messageRepository.save(message);
          }

  async getMessages(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
    });
  }
}
