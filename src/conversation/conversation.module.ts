import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { Message } from '../message/message.entity';
import { User } from '../users/entities/user.entity';


@Module({

  imports: [TypeOrmModule.forFeature([Conversation, Message, User])],
  providers: [ConversationService],
  controllers: [ConversationController]
})
export class ConversationModule {}
