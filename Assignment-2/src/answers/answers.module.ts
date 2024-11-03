import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { QuestionsModule } from '../questions/questions.module'; // Import QuestionsModule

@Module({
  imports: [QuestionsModule], // Import QuestionsModule to use its service
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
