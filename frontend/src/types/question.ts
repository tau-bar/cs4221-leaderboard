export type QuestionDto = {
  id: number;
  name: string;
  description: string;
  question_schema: string;
  question_data: string;
  answer_data: string;
  max_timeout: number;
};

export type SubmissionDto = {
  student_id: number;
  question_id: number;
  submission_time: Date;
  is_correct: boolean;
  planning_time: number;
  execution_time: number;
  query: string;
  status: string;
};
