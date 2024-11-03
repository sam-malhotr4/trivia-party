// answers/answers.service.ts
import { Injectable } from '@nestjs/common';
import { QuestionsService } from '../questions/questions.service';
import { AnswerDto } from './answers.dto';

@Injectable()
export class AnswersService {
  constructor(private readonly questionsService: QuestionsService) {}

  async checkAnswer(answerDto: AnswerDto) {
    // Call checkAnswer in QuestionsService with questionId and selectedOption
    const isCorrect = await this.questionsService.checkAnswer(answerDto.questionId, answerDto.selectedOption);
    return {
      result: isCorrect ? 'win' : 'lose',
    };
  }
}
 