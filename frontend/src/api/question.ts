import axios from 'axios';
import type { QuestionDto, SubmissionDto } from '../types/question';

const API_URL = process.env.REACT_APP_API_URL || 'localhost:3000';

export async function getQuestion(id: number): Promise<QuestionDto | null> {
  const resp = await axios.get<QuestionDto>(`${API_URL}/question/${id}`);
  return resp.data;
}

export async function submitQuery(
  question_id: number,
  query: string,
): Promise<SubmissionDto> {
  const resp = await axios.post<SubmissionDto>(`${API_URL}/admin/submit`, {
    student_id: 1, // TODO: remove hardcoding
    question_id: 2, // TODO: remove hardcoding
    query: query,
  });
  return resp.data;
}

export enum QuestionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export async function getSubmissions(
  student_id: number,
  question_id: number,
): Promise<SubmissionDto[]> {
  return [
    {
      student_id: student_id,
      question_id: question_id,
      submission_time: new Date('2024-03-23T08:00:00Z'),
      is_correct: true,
      planning_time: 5,
      execution_time: 10,
      query: 'SELECT * FROM students WHERE age > 20;',
      status: QuestionStatus.PENDING,
    },
    {
      student_id: student_id,
      question_id: question_id,
      submission_time: new Date('2024-03-23T08:05:00Z'),
      is_correct: false,
      planning_time: 3,
      execution_time: 15,
      query: 'SELECT name, age FROM students WHERE age > 25;',
      status: QuestionStatus.COMPLETED,
    },
    {
      student_id: student_id,
      question_id: question_id,
      submission_time: new Date('2024-03-23T08:10:00Z'),
      is_correct: true,
      planning_time: 7,
      execution_time: 8,
      query: 'SELECT COUNT(*) FROM orders;',
      status: QuestionStatus.COMPLETED,
    },
    {
      student_id: student_id,
      question_id: question_id,
      submission_time: new Date('2024-03-23T08:15:00Z'),
      is_correct: true,
      planning_time: 4,
      execution_time: 12,
      query: 'SELECT AVG(amount) FROM orders WHERE status = "completed";',
      status: QuestionStatus.COMPLETED,
    },
    {
      student_id: student_id,
      question_id: question_id,
      submission_time: new Date('2024-03-23T08:20:00Z'),
      is_correct: false,
      planning_time: 6,
      execution_time: 20,
      query: 'SELECT MAX(quantity) FROM products;',
      status: QuestionStatus.COMPLETED,
    },
  ];

  // TODO: backend integration
}
