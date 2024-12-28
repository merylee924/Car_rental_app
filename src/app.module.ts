import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity'; // Entité User
import { Agency } from './agency/entities/agency.entity'; // Entité Agency
import { Car } from './car/entities/car.entity'; // Entité Car
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { AgencyModule } from './agency/agency.module';
import { CarModule } from './car/car.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Utilisation de PostgreSQL
      host: 'localhost', // Adresse du serveur PostgreSQL
      port: 15432, // Port exposé par votre service PostgreSQL
      username: 'ilisi', // Utilisateur de la base de données
      password: 'ilisi', // Mot de passe de la base de données
      database: 'car_rental', // Nom de la base de données
      entities: [User, Agency, Car], // Liste de toutes les entités
      synchronize: true, // Synchronisation automatique (ne pas utiliser en production)
      logging: true, // Log des requêtes SQL
    }),
    TypeOrmModule.forFeature([User, Agency, Car]), // Déclaration des entités pour TypeORM
    AgencyModule, // Module Agency
    CarModule, // Module Car
  ],
  controllers: [UsersController], // Déclaration des contrôleurs
  providers: [UsersService], // Déclaration des services
})
export class AppModule {}
