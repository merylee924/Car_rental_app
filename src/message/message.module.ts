import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '../conversation/conversation.entity';
import { Message } from '../message/message.entity';
import { MessageGateway } from './message.gateway';

@Module({

  imports: [TypeOrmModule.forFeature([Conversation, Message, User])],
  providers: [MessageService,MessageGateway],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
