import { Controller, Post, Body,Param,Get, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Post('register')
async register(@Body() createUserDto: CreateUserDto) {
  const {
    username,
    password,
    firstName,
    lastName,
    email,
    picture,
    phoneNumber,
    role
  } = createUserDto;

  return this.usersService.createUser(
    username,
    password,
    firstName,
    lastName,
    email,
    picture,
    phoneNumber,
    role
  );
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

 @Get(':username')
  async getUserInfo(@Param('username') username: string) {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  @Get(':username/cars')
  async getCarsByUsername(@Param('username') username: string) {
    return this.usersService.findCarsByUsername(username);
  }




}
