import axios from 'axios';
import { CreateQuestionDto, QuestionDto, Response } from '../types/question';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getQuestions = async (page: number = 1, limit: number = 10) => {
  const resp = await axios.get<QuestionDto[]>(
    `${API_URL}/question/list?page=${page}&limit=${limit}`,
  );
  return resp.data;
};

export const getQuestionCount = async () => {
  const resp = await axios.get<number>(`${API_URL}/question/count`);
  return resp.data;
};

export const createQuestion = async (questionData: CreateQuestionDto) => {
  const resp = await axios.post<Response>(`${API_URL}/question/create`, questionData);
  return resp.data;
};