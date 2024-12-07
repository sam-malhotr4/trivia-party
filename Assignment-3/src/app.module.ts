import { Module } from '@nestjs/common';

import { QuestionsModule } from './questions/questions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersModule } from './answers/answers.module';
import { UserController } from './users/userController';
import { UserService } from './users/userService';
import { User, UserSchema } from './users/user.schema';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [  
    MongooseModule.forRoot('mongodb://localhost:27017/trivia_party'),
    QuestionsModule,
    AuthModule,
    UsersModule,
    AnswersModule,
    RoomsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    
  ],
  controllers: [UserController],
  providers: [UserService, GameGateway],
  
})
export class AppModule {}
