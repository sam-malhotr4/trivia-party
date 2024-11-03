import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuestionsModule } from './questions/questions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersModule } from './answers/answers.module';

@Module({
  imports: [  
     MongooseModule.forRoot('mongodb://localhost:27017/trivia_party'),
    QuestionsModule,
    AnswersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
