import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity'; // Entité User
import { Agency } from './agency/entities/agency.entity'; // Entité Agency
import { Car } from './car/entities/car.entity'; // Entité Car
import { Reservation } from './reservation/entities/reservation.entity'; // Entité Car
import { Brand } from './brand/entities/brand.entity'; // Entité Car
import { Model } from './model/entities/model.entity'; // Entité Car
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { AgencyModule } from './agency/agency.module';
import { CarModule } from './car/car.module';
import { BrandModule } from './brand/brand.module';
import { ModelModule } from './model/model.module';
import { ReservationModule } from "./reservation/reservation.module"
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { Conversation } from './conversation/conversation.entity';
import { Message } from './message/message.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 15432,
      username: 'ilisi',
      password: 'ilisi',
      database: 'car_rental',
      entities: [User, Agency, Car, Brand, Model, Reservation, Conversation, Message], // Ajoute Conversation et Message ici
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Agency, Car, Brand, Model, Reservation, Conversation, Message]), // Ajouter également ici
    AgencyModule,
    CarModule,
    BrandModule,
    ModelModule,
    ReservationModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
