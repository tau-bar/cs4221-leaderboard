export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  submittedDate: string;
  executionTime: number;
  planningTime: number;
  totalTime: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardDTO {
  curr_student: LeaderboardEntry | null;
  leaderboardEntries: LeaderboardEntry[];
  question_id: number;
  total: number;
}
