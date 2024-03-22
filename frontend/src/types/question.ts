export type QuestionDto = {
  id: number;
  name: string;
  description: string;
  question_schema: string;
  question_data: string;
  answer_data: string;
  max_timeout: number;
};
