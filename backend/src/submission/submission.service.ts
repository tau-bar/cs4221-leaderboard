import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission } from './entities/submission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { SubmissionKeyDto } from './dto/submission-key.dto';
import { LeaderboardDTO, LeaderboardEntry } from './dto/leaderboard.dto';

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
    const rawQuery = `
    WITH RankedSubmissions AS (
      SELECT
        student_id,
        submission_time,
        execution_time,
        planning_time,
        (execution_time + planning_time) AS total_time,
        RANK() OVER (
          PARTITION BY student_id
          ORDER BY (execution_time + planning_time), submission_time
        ) AS rank
      FROM admin.submission
      WHERE
        question_id = $1 AND
        is_correct = true
    )
    SELECT
      student_id,
      submission_time,
      execution_time,
      planning_time,
      total_time
    FROM RankedSubmissions
    WHERE rank = 1
    OFFSET $2 LIMIT $3;
  `;

    const results = await this.submissionRepository.query(rawQuery, [
      question_id,
      skip,
      size,
    ]);

    console.log(results);

    // Find total number of unique students with correct submissions
    const totalStudents = results.length;

    // // Paginate the rawSubmissions based on the page and size
    // const paginatedSubmissions = rawSubmissions.slice(skip, skip + size);

    // Transform submissions into LeaderboardEntries
    const leaderboardEntries: LeaderboardEntry[] = results.map(
      (submission, index) => ({
        rank: skip + index + 1,
        studentName: submission.student_id, // Placeholder for student name
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
      const currentUserSubmission = await this.submissionRepository.findOne({
        where: {
          student_id: student_id,
          question_id: question_id,
          is_correct: true,
        },
        order: {
          execution_time: 'ASC',
          planning_time: 'ASC',
          submission_time: 'ASC',
        }, // Tiebreaker order
      });
      if (currentUserSubmission) {
        curr_student = {
          rank: 0, // The actual rank needs to be calculated if necessary
          studentName: currentUserSubmission.student_id, // Placeholder for student name
          submittedDate: currentUserSubmission.submission_time.toISOString(),
          executionTime: Number(currentUserSubmission.execution_time),
          planningTime: Number(currentUserSubmission.planning_time),
          totalTime:
            Number(currentUserSubmission.execution_time) +
            Number(currentUserSubmission.planning_time),
          isCurrentUser: true,
        };
      }
    }

    // Return the DTO with the current student's submission, question ID, and total number of students
    return {
      curr_student: curr_student,
      leaderboardEntries: leaderboardEntries,
      question_id: question_id,
      total: totalStudents,
    };
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
