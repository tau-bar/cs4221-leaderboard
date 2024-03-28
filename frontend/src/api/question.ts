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
  TIMEOUT = 'TIMEOUT',
  FAILED = 'FAILED',
}

export async function getSubmissions(
  student_id: number,
  question_id: number,
): Promise<SubmissionDto[]> {
  student_id = 1; // TODO: remove hardcoding
  const resp = await axios.get<SubmissionDto[]>(
    `${API_URL}/admin/submissions?student_id=${student_id}&question_id=${question_id}`,
  );
  return resp.data;
}
