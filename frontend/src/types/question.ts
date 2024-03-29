export type QuestionDto = {
  id: number;
  question_name: string;
  schema_name: string;
  description: string;
  question_schema: string;
  question_data: string;
  sample_answer: string;
  answer_data: string;
  max_timeout: number;
};

export type CreateQuestionDto = {
  question_name: string;
  schema_name: string;
  description: string;
  question_schema: string;
  question_data: string;
  sample_answer: string;
  answer_data: string;
  max_timeout: number;
}