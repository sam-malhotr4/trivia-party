import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }
 
  async login(user: User) {
    
    console.log('User Data in Login:', user);

    const payload = { username: user.username, sub: user._id, roles: user.roles }; 
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
