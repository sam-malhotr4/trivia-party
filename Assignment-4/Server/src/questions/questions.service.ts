// File: src/questions/questions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './questions.schema';
import { log } from 'console';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) { }

  async getRandomQuestion() {
    const count = await this.questionModel.countDocuments();
    if (count === 0) {
      throw new NotFoundException('No questions available');
    }
    const randomIndex = Math.floor(Math.random() * count);
    const randomQuestion = await this.questionModel.findOne().skip(randomIndex).exec();
    console.log("random question", randomQuestion)
    return randomQuestion;
  }

  async addQuestion(questionData: { question: string; options: string[]; correctAnswer: string }) {
    const question = new this.questionModel(questionData);
    return await question.save();
  }

  async checkAnswer(questionId: string, selectedOption: string): Promise<boolean> {
    const question = await this.questionModel.findById(questionId);
    if (!question) {
      console.error(`Question with ID ${questionId} not found.`);
      throw new NotFoundException('Question not found');
    }
    return question.correctAnswer.trim().toLowerCase() === selectedOption.trim().toLowerCase();
  }
}
