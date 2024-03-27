import axios from 'axios';
import { QuestionDto } from '../types/question';

const API_URL = process.env.REACT_APP_API_URL || 'localhost:3000';

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
