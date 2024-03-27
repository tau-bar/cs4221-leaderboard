import axios from 'axios';
import { QuestionDto } from '../types/question';

export const getQuestions = async (page: number = 1, limit: number = 10) => {
  const resp = await axios.get<QuestionDto[]>(
    `/question?page=${page}&limit=${limit}`,
  );
  return resp.data;
};
