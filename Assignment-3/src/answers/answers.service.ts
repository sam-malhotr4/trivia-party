// File: src/answers/answers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsService } from '../questions/questions.service';
import { AnswerDto } from './answers.dto';

@Injectable()
export class AnswersService {
  constructor(private readonly questionsService: QuestionsService) { }

  async checkAnswer(answerDto: AnswerDto) {
    const { questionId, selectedOption } = answerDto;

    
    const isCorrect = await this.questionsService.checkAnswer(questionId, selectedOption);
    if (isCorrect === null) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    return {
      result: isCorrect ? 'win' : 'lose',
    };
  }
}
