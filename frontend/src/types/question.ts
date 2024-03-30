import { QuestionStatus } from '../api/question';

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

export type Response = {
  success: boolean;
  data: QuestionDto;
  error: string;
}

export type SubmissionDto = {
  student_id: number;
  question_id: number;
  submission_time: string;
  is_correct: boolean;
  planning_time: number;
  execution_time: number;
  query: string;
  status: QuestionStatus;
};

