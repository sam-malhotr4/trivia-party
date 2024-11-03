// answers/answers.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswerDto } from './answers.dto';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  async submitAnswer(@Body() answerDto: AnswerDto) {
    return this.answersService.checkAnswer(answerDto);
  }
}
