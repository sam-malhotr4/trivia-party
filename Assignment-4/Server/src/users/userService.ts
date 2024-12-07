import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.schema';
import { Roles } from 'src/auth/roles.decorator';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async register(username: string, email: string, password: string, roles:string[]=['user']): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, email, password: hashedPassword, roles });
    return newUser.save();
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; // Return the user instead of a boolean
    }
    return null;
  }

  generateJwt(user: User): string {
    const payload = { username: user.username, sub: user._id, roles: user.roles }; // Customize payload
    return this.jwtService.sign(payload); // Return the signed JWT token
  }


}
