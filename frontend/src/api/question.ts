import type { QuestionDto, SubmissionDto } from '../types/question';

export async function getQuestion(id: number): Promise<QuestionDto | null> {
  return {
    id: id,
    name: `Question ${id}`,
    description: `Description for Question ${id}`,
    question_schema: `Schema for Question ${id}`,
    question_data: `Data for Question ${id}`,
    answer_data: `Answer Data for Question ${id}`,
    max_timeout: 60,
  };
  // TODO: backend integration
  // const response = await fetch(`/api/question/${id}`);
  // return response.json();
}

export async function submitQuery(id: number, query: string): Promise<boolean> {
  console.log(`Submitted ${query} for question ${id}`);
  return true;
  // TODO: backend integration
  // const response = await fetch(`/api/question/${id}/submit`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ query }),
  // });
  // return response.ok;
}

export enum QuestionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export async function getSubmissions(
  student_id: number,
  question_id: number,
): Promise<SubmissionDto[]> {
  return [
    {
      student_id: student_id,
      question_id: question_id,
      submission_time: new Date('2024-03-25T08:00:00Z'),
      is_correct: true,
      planning_time: 5,
      execution_time: 10,
      query: 'SELECT * FROM students WHERE age > 20;',
      status: QuestionStatus.PENDING,
    },
    {
      student_id: student_id,
      question_id: question_id,
      submission_time: new Date('2024-03-25T08:05:00Z'),
      is_correct: false,
      planning_time: 3,
      execution_time: 15,
      query: 'SELECT name, age FROM students WHERE age > 25;',
      status: QuestionStatus.COMPLETED,
    },
    {
      student_id: student_id,
      question_id: question_id,
      submission_time: new Date('2024-03-25T08:10:00Z'),
      is_correct: true,
      planning_time: 7,
      execution_time: 8,
      query: 'SELECT COUNT(*) FROM orders;',
      status: QuestionStatus.COMPLETED,
    },
    {
      student_id: student_id,
      question_id: question_id,
      submission_time: new Date('2024-03-25T08:15:00Z'),
      is_correct: true,
      planning_time: 4,
      execution_time: 12,
      query: 'SELECT AVG(amount) FROM orders WHERE status = "completed";',
      status: QuestionStatus.COMPLETED,
    },
    {
      student_id: student_id,
      question_id: question_id,
      submission_time: new Date('2024-03-25T08:20:00Z'),
      is_correct: false,
      planning_time: 6,
      execution_time: 20,
      query: 'SELECT MAX(quantity) FROM products;',
      status: QuestionStatus.COMPLETED,
    },
  ];

  // TODO: backend integration
}
