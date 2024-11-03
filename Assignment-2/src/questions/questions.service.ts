// questions/questions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './questions.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async getRandomQuestion() {
    const count = await this.questionModel.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomQuestion = await this.questionModel.findOne().skip(randomIndex).exec();
    return randomQuestion;
  }
   async addQuestion(questionData: { question: string; options: string[]; correctAnswer: string }) {
    const question = new this.questionModel(questionData);
    return await question.save();
}
  async checkAnswer(questionId: string, selectedOption: string): Promise<boolean> {
    // Find question by ID
    const question = await this.questionModel.findById(questionId);
    if (!question) {
      console.log(`Question with ID ${questionId} not found.`);
      return false;
    }

    // Check if the answer is correct
    return question.correctAnswer.trim().toLowerCase() === selectedOption.trim().toLowerCase();
  }
}
