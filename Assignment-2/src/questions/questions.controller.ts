import { Controller, Get, Post, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('random')
  getRandomQuestion() {
    return this.questionsService.getRandomQuestion();
  }
  
}
