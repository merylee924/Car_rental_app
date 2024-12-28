import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

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
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      picture,
    });
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
