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
    const rawSubmissions = await this.submissionRepository
      .createQueryBuilder('submission')
      .select('submission.student_id', 'studentId')
      .addSelect('MIN(submission.submission_time)', 'submittedDate')
      .addSelect('MIN(submission.execution_time)', 'executionTime')
      .addSelect('MIN(submission.planning_time)', 'planningTime')
      .addSelect(
        'MIN(submission.execution_time + submission.planning_time)',
        'totalTime',
      ) // Calculate total time
      .where('submission.question_id = :question_id', { question_id })
      .andWhere('submission.is_correct = true')
      .groupBy('submission.student_id')
      .orderBy(
        'MIN(submission.execution_time + submission.planning_time)',
        'ASC',
      ) // Directly calculate and order by total time
      .addOrderBy('MIN(submission.execution_time)', 'ASC') // Then by execution time
      .addOrderBy('MIN(submission.planning_time)', 'ASC') // Then by planning time
      .addOrderBy('MIN(submission.submission_time)', 'ASC') // Finally by submitted date
      .limit(size)
      .offset(skip)
      .getRawMany();

    // Find total number of unique students with correct submissions
    const totalStudents = rawSubmissions.length;

    // // Paginate the rawSubmissions based on the page and size
    // const paginatedSubmissions = rawSubmissions.slice(skip, skip + size);

    // Transform submissions into LeaderboardEntries
    const leaderboardEntries: LeaderboardEntry[] = rawSubmissions.map(
      (submission, index) => ({
        rank: skip + index + 1,
        studentName: submission.studentId, // Placeholder for student name
        submittedDate: submission.submittedDate.toISOString(),
        executionTime: Number(submission.executionTime),
        planningTime: Number(submission.planningTime),
        totalTime: Number(submission.totalTime),
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
