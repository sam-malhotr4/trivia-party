// File: src/questions/questions.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) { }

  @Get('random')
  
  @Roles('user', 'admin') 
  getRandomQuestion() {
    console.log("fetching a random question")
    return this.questionsService.getRandomQuestion();
  }

  @Post('add')
  @Roles('admin')
  addQuestion(@Body() questionData: { question: string; options: string[]; correctAnswer: string }) {
    return this.questionsService.addQuestion(questionData);
  }

  @Get('admin-only')
  @Roles('admin') 
  getAdminData() {
    return { message: 'This is an admin-only endpoint' };
  }
}
