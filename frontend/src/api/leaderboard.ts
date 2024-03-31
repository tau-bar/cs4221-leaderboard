import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  submittedDate: string;
  executionTime: number; // in seconds
  planningTime: number; // in seconds
  totalTime: number; // in seconds
  isCurrentUser?: boolean; // To identify the current user's submission
}

export interface LeaderboardDTO {
  curr_student: LeaderboardEntry | null;
  leaderboardEntries: LeaderboardEntry[];
  question_id: number;
  total: number;
}

export async function getLeaderboard(
  student_id: string,
  question_id: number,
  page: number = 1,
  size: number = 10,
): Promise<LeaderboardDTO> {
  const resp = await axios.get<LeaderboardDTO>(
    `${API_URL}/admin/leaderboard?student_id=${student_id}&question_id=${question_id}&page=${page}&size=${size}`,
  );
  return resp.data;
}
