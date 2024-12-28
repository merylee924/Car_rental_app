import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { username, password, firstName, lastName, email, picture } = createUserDto;
    return this.usersService.createUser(username, password, firstName, lastName, email, picture);
  }

  @Post('login')
    async login(@Body() loginDto: { username: string; password: string }) {
      const { username, password } = loginDto;
      const user = await this.usersService.validateUser(username, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return {
        message: 'Login successful',
        user,
      };
    }
}
