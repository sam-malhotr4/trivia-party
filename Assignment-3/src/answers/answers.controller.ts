// File: src/answers/answers.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswerDto } from './answers.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('answers')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class AnswersController {
  constructor(private readonly answersService: AnswersService) { }
 
  @Post()
  async submitAnswer(@Body() answerDto: AnswerDto) {
    return this.answersService.checkAnswer(answerDto);
  }
}
