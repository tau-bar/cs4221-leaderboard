import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission } from './entities/submission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { SubmissionKeyDto } from './dto/submission-key.dto';
import { LeaderboardDTO, LeaderboardEntry } from './dto/leaderboard.dto';

const CTES = `
WITH CorrectSubmissions AS (
  SELECT
    s.student_id,
    s.submission_time,
    s.execution_time,
    s.planning_time,
    (s.execution_time + s.planning_time) AS total_time,
    RANK() OVER (
      PARTITION BY s.student_id
      ORDER BY (s.execution_time + s.planning_time), s.submission_time
    ) AS rank_within_student
  FROM admin.submission s
  WHERE
    s.question_id = $1 AND
    s.is_correct = true
),
MinTotalTimeSubmissions AS (
  SELECT
    student_id,
    submission_time,
    execution_time,
    planning_time,
    total_time
  FROM CorrectSubmissions
  WHERE rank_within_student = 1
),
RankedSubmissions AS (
  SELECT
    mts.student_id,
    st.name AS student_name,
    mts.submission_time,
    mts.execution_time,
    mts.planning_time,
    mts.total_time,
    RANK() OVER (
      ORDER BY mts.total_time, mts.submission_time
    ) AS absolute_rank
  FROM MinTotalTimeSubmissions mts
  JOIN admin.student st ON mts.student_id = st.id
)`;
@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission, 'admin')
    private readonly submissionRepository: Repository<Submission>,
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    return await this.submissionRepository.save(createSubmissionDto);
  }

  async findAll(): Promise<Submission[]> {
    return await this.submissionRepository.find();
  }

  async findByStudentIdAndQuestionIdAndIsCorrectOrderBySubmissionTimeDesc(
    student_id: string,
    question_id: number,
    is_correct: boolean,
  ): Promise<Submission[]> {
    return await this.submissionRepository.find({
      where: {
        student_id: student_id,
        question_id: question_id,
        is_correct: is_correct,
      },
      order: {
        submission_time: 'DESC',
      },
    });
  }

  async findByStudentIdAndQuestionIdOrderBySubmissionTimeDesc(
    student_id: string,
    question_id: number,
  ): Promise<Submission[]> {
    return await this.submissionRepository.find({
      where: {
        student_id: student_id,
        question_id: question_id,
      },
      order: {
        submission_time: 'DESC',
      },
    });
  }

  async getLeaderboard(
    student_id: string,
    question_id: number,
    page: number,
    size: number,
  ): Promise<LeaderboardDTO> {
    const skip = (page - 1) * size;

    // Query to get the earliest and fastest correct submission per student
    const rawQueryToGetCurrPage = `
    ${CTES}
    SELECT
      student_id,
      student_name,
      submission_time,
      execution_time,
      planning_time,
      total_time,
      absolute_rank AS rank
    FROM RankedSubmissions
    ORDER BY absolute_rank
    OFFSET $2 LIMIT $3;    
  `;

    const results = await this.submissionRepository.query(
      rawQueryToGetCurrPage,
      [question_id, skip, size],
    );

    console.log(results);

    const rawQueryToGetTotal = `
    ${CTES}
    SELECT
      count(*)
    FROM RankedSubmissions
  `;

    // Find total number of unique students with correct submissions
    const total = await this.submissionRepository.query(rawQueryToGetTotal, [
      question_id,
    ]);

    const totalStudents = total[0].count || 0;

    // Transform submissions into LeaderboardEntries
    const leaderboardEntries: LeaderboardEntry[] = results.map(
      (submission, index) => ({
        rank: skip + index + 1,
        studentName: submission.student_name,
        submittedDate: submission.submission_time,
        executionTime: Number(submission.execution_time),
        planningTime: Number(submission.planning_time),
        totalTime: Number(submission.total_time),
        isCurrentUser: submission.studentId === student_id,
      }),
    );

    // Determine if the current student's submission is in the paginated results
    let curr_student: LeaderboardEntry | null =
      leaderboardEntries.find((entry) => entry.isCurrentUser) || null;

    // If the current student's submission is not in the paginated results, fetch it separately
    if (!curr_student) {
      curr_student = await this.getCurrentStudentRank(question_id, student_id);
    }

    // Return the DTO with the current student's submission, question ID, and total number of students
    return {
      curr_student: curr_student,
      leaderboardEntries: leaderboardEntries,
      question_id: question_id,
      total: totalStudents,
    };
  }

  async getCurrentStudentRank(
    question_id: number,
    student_id: string,
  ): Promise<LeaderboardEntry | null> {
    const rawQuery = `
    ${CTES}
    SELECT
      student_id,
      student_name,
      submission_time,
      execution_time,
      planning_time,
      total_time,
      absolute_rank AS rank
    FROM RankedSubmissions
    WHERE student_id = $2;
    `;
    const result = await this.submissionRepository.query(rawQuery, [
      question_id,
      student_id,
    ]);
    if (result && result.length > 0) {
      const submission = result[0];
      return {
        rank: submission.rank,
        studentName: submission.student_name,
        submittedDate: submission.submission_time,
        executionTime: Number(submission.execution_time),
        planningTime: Number(submission.planning_time),
        totalTime: Number(submission.total_time),
        isCurrentUser: true,
      };
    }

    return null;
  }

  async findByKey(key: SubmissionKeyDto): Promise<Submission> {
    return await this.submissionRepository.findOne({
      where: {
        student_id: key.student_id,
        question_id: key.question_id,
        submission_time: key.submission_time,
      },
    });
  }

  async update(
    key: SubmissionKeyDto,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<UpdateResult> {
    return await this.submissionRepository.update(key, updateSubmissionDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.submissionRepository.delete(id);
  }
}
