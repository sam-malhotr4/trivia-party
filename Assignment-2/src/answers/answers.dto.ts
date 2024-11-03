
// answers/answer.dto.ts
export class AnswerDto {
  questionId: string; // Use string here to align with MongoDB _id format
  selectedOption: string;
}
