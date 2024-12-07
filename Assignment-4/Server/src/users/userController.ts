import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './userService';
import { Response } from 'express';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.register(username, email, password);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'User registered successfully', user });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Registration failed', error });
    }
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const user = await this.userService.validateUser(username, password);
    if (user) {
      const token = this.userService.generateJwt(user);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Login successful', token });
    } else {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }
  }
  

}
