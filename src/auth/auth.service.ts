import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private users = [];

  constructor() {
    this.initializeUsers();
  }

  async initializeUsers() {
    this.users = [
      {
        id: 1,
        username: 'testuser',
        password: await this.hashPassword('password123'),
      },
    ];
  }

  async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcrypt');
    return await bcrypt.hash(password, 10);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find((u) => u.username === username);
    if (user && (await this.comparePassword(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async comparePassword(plainText: string, hashed: string): Promise<boolean> {
    const bcrypt = require('bcrypt'); // Import dynamique
    return await bcrypt.compare(plainText, hashed);
  }

  async login(user: any): Promise<any> {
    return {
      userId: user.id,
      username: user.username,
      message: 'Login successful',
    };
  }
}
