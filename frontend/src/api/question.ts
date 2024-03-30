import axios from 'axios';
import type { QuestionDto, SubmissionDto } from '../types/question';
import { GoogleUserInfo } from '../types/oauth';

const API_URL = process.env.REACT_APP_API_URL || 'localhost:3000';

export async function getQuestion(id: number): Promise<QuestionDto | null> {
  const resp = await axios.get<QuestionDto>(`${API_URL}/question/${id}`);
  return resp.data;
}

export async function submitQuery(
  student: GoogleUserInfo,
  question_id: number,
  query: string,
): Promise<SubmissionDto> {
  const resp = await axios.post<SubmissionDto>(`${API_URL}/admin/submit`, {
    student_id: student.id,
    student_name: student.name,
    student_email: student.email,
    question_id: question_id,
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
  student_id: string,
  question_id: number,
): Promise<SubmissionDto[]> {
  const resp = await axios.get<SubmissionDto[]>(
    `${API_URL}/admin/submissions?student_id=${student_id}&question_id=${question_id}`,
  );
  return resp.data;
}
