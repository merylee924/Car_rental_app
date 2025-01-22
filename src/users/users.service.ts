import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import UserRole from './userRole'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
 async createUser(
   username: string,
   plainPassword: string,
   firstName: string,
   lastName: string,
   email: string,
   picture?: string,
   phoneNumber?: string,
   role?: UserRole
 ): Promise<User> {
   const hashedPassword = await bcrypt.hash(plainPassword, 10);

   // Si une image est fournie, valider sa taille (par exemple, ne pas dépasser 2MB)
   if (picture) {
     const base64Pattern = /^data:image\/([a-zA-Z]*);base64,([^\"]+)$/;
     if (!base64Pattern.test(picture)) {
       throw new Error('Invalid base64 image format.');
     }

     // Optionnel : vérifier la taille de l'image
     const base64Data = picture.split(',')[1];  // Découper le préfixe 'data:image/...'
     const imageBuffer = Buffer.from(base64Data, 'base64');
     if (imageBuffer.length > 2 * 1024 * 1024) {  // 2MB max
       throw new Error('Image size exceeds the 2MB limit.');
     }
   }

   // Créer un nouvel utilisateur
   const user = this.userRepository.create({
     username,
     password: hashedPassword,
     firstName,
     lastName,
     email,
     picture,
     phoneNumber,
     role: role || UserRole.CLIENT,
   });

   // Enregistrer l'utilisateur dans la base de données
   return this.userRepository.save(user);
 }


async findUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user; // Exclure le mot de passe des données renvoyées
      return result;
    }
    return null;
  }

}
