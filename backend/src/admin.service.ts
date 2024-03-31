import { Injectable } from '@nestjs/common';
import { QuestionService } from './question/question.service';
import { StudentService } from './student/student.service';
import { SubmissionService } from './submission/submission.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueueService } from './queue/queue.service';
import { SubmissionKeyDto } from './submission/dto/submission-key.dto';
import { CreateSubmissionDto } from './submission/dto/create-submission.dto';
import { SubmissionDto } from './submission/dto/submission.dto';
import { QueueWorkerCallback } from 'queue';
import { SUBMISSION_STATUS } from './submission/constants/submission.constant';
import { StudentDto } from './student/dto/student.dto';
import { LeaderboardDTO } from './submission/dto/leaderboard.dto';
import { isEqual } from 'lodash';

@Injectable()
export class AdminService {
  constructor(
    @InjectDataSource('admin') private readonly adminDataSource: DataSource,
    @InjectDataSource('participant')
    private readonly participantDataSource: DataSource,
    private readonly queueService: QueueService,
    private readonly questionService: QuestionService,
    private readonly studentService: StudentService,
    private readonly submissionService: SubmissionService,
  ) {}

  async setupQuestion(
    schema_name: string,
    question_schema: string,
    question_data: string,
  ): Promise<void> {
    const queryRunner = this.adminDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`CREATE SCHEMA ${schema_name}`);
    await queryRunner.query(
      `alter default privileges for role ${process.env.ADMIN_USERNAME} in schema ${schema_name} grant select on tables to ${process.env.PARTICIPANT_USERNAME};`,
    );
    await queryRunner.query(`SET LOCAL SEARCH_PATH=${schema_name}`);
    await queryRunner.query(question_schema);
    await queryRunner.query(question_data);
    await queryRunner.query(`SET LOCAL SEARCH_PATH=public`);
    await queryRunner.release();
  }

  async getSubmission(key: SubmissionKeyDto): Promise<SubmissionDto> {
    return this.submissionService.findByKey(key);
  }

  async getAllSubmissions(
    student_id: string,
    question_id: number,
  ): Promise<SubmissionDto[]> {
    return await this.submissionService.findByStudentIdAndQuestionIdOrderBySubmissionTimeDesc(
      student_id,
      question_id,
    );
  }

  async getAllCorrectSubmissions(
    student_id: string,
    question_id: number,
  ): Promise<SubmissionDto[]> {
    return await this.submissionService.findByStudentIdAndQuestionIdAndIsCorrectOrderBySubmissionTimeDesc(
      student_id,
      question_id,
      true,
    );
  }

  async getLeaderboard(
    student_id: string,
    question_id: number,
    page: number,
    size: number,
  ): Promise<LeaderboardDTO> {
    return await this.submissionService.getLeaderboard(
      student_id,
      question_id,
      page,
      size,
    );
  }

  async queueSubmissionEvaluation(
    studentDto: StudentDto,
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<SubmissionDto> {
    await this.createStudentIfNotExist(studentDto);

    const submission = await this.submissionService.create(createSubmissionDto);

    const question = await this.questionService.findByKey(
      submission.question_id,
    );
    const resetStatRunner = this.adminDataSource.createQueryRunner();
    const queryRunner = this.participantDataSource.createQueryRunner();
    const service = this.submissionService;

    const run_count = parseInt(process.env.RUN_COUNT);

    const task = async function (cb: QueueWorkerCallback) {
      var expected_result = [];
      var actual_result = [];
      var analysis = null;
      const planning_times = [];
      const execution_times = [];
      try {
        // admin permissions required to reset pg stat tables
        await resetStatRunner.connect();
        // reset pg_stat tables + free used space + analyze tables
        await resetStatRunner.query('SELECT pg_stat_reset();');
        await resetStatRunner.query('VACUUM ANALYZE;');
        await resetStatRunner.release();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        // set statement timeout for transaction
        await queryRunner.query(
          `SET LOCAL SEARCH_PATH = ${question.schema_name};`,
        );
        await queryRunner.query(
          `SET LOCAL statement_timeout='${question.max_timeout}ms';`,
        );
        // get query plan
        for (let i = 0; i < run_count; i++) {
          analysis = await queryRunner.query(
            `EXPLAIN ANALYZE ${submission.query}`,
          );
          if (analysis != null) {
            planning_times.push(
              parseFloat(
                analysis[analysis.length - 2]['QUERY PLAN'].substring(15, 20),
              ),
            );
            execution_times.push(
              parseFloat(
                analysis[analysis.length - 1]['QUERY PLAN'].substring(16, 21),
              ),
            );
          }
        }
        // get query results
        expected_result = await queryRunner.query(question.sample_answer);
        actual_result = await queryRunner.query(submission.query);
        await queryRunner.commitTransaction();
        await queryRunner.release();
      } catch (error) {
        cb(error);
        throw error;
      }

      // calculate median planning time and execution time
      if (planning_times.length > 0) {
        planning_times.sort((a, b) => a - b);
        const half = Math.floor(planning_times.length / 2);
        submission.planning_time = planning_times.length % 2
          ? planning_times[half]
          : (planning_times[half - 1] + planning_times[half]) / 2;
        submission.planning_time = parseFloat(submission.planning_time.toFixed(2));
      }

      if (execution_times.length > 0) {
        execution_times.sort((a, b) => a - b);
        const half = Math.floor(execution_times.length / 2);
        submission.execution_time = execution_times.length % 2
          ? execution_times[half]
          : (execution_times[half - 1] + execution_times[half]) / 2;
        submission.execution_time = parseFloat(submission.execution_time.toFixed(2));
      }

      // verify correctness of query
      let is_correct = true;
      if (expected_result.length !== actual_result.length) {
        is_correct = false;
      } else {
        for (let i = 0; i < expected_result.length; i++) {
          const actual_row = actual_result[i];
          const expected_row = expected_result[i];
          const keys = Object.keys(expected_row);
          let is_row_correct = true;
          for (let key of keys) {
            // if key in expected row is not in actual row or the value is different
            if (
              !actual_row.hasOwnProperty(key) || !isEqual(actual_row[key], expected_row[key])
            ) {
              is_row_correct = false;
              break;
            }
          }
          if (!is_row_correct) {
            is_correct = false;
            break;
          }
        }
      }

      submission.is_correct = is_correct;
      cb(null, { submission });
    };

    // timeout here is different from the statement timeout
    // this timeout refers to the timeout for the queue task, NOT for the query execution
    // 5 is arbitrary, but should be enough to handle most evaluation cases
    const queue_timeout_multiplier = parseInt(
      process.env.QUEUE_TIMEOUT_MULTIPLIER,
    );
    task.timeout = question.max_timeout * run_count * queue_timeout_multiplier;

    // handleSuccess, handleError, and handleTimeout are callback functions that are called when the task is done
    task.handleSuccess = async function (result: any) {
      const submission = result.submission;
      submission.status = SUBMISSION_STATUS.COMPLETED;
      await service.update(
        {
          student_id: submission.student_id,
          question_id: submission.question_id,
          submission_time: submission.submission_time,
        },
        submission,
      );
    };

    task.handleTimeout = async function () {
      console.log(`Timeout for submission {${submission.student_id},${submission.question_id},${submission.submission_time}}`)
      submission.status = SUBMISSION_STATUS.FAILED;
      await service.update(
        {
          student_id: submission.student_id,
          question_id: submission.question_id,
          submission_time: submission.submission_time,
        },
        submission,
      );
    };

    task.handleError = async function (err: Error) {
      console.log(err.message)
      // recognize statement timeout error
      if (err.message === 'canceling statement due to statement timeout') {
        submission.status = SUBMISSION_STATUS.TIMEOUT;
      } else {
        submission.status = SUBMISSION_STATUS.FAILED;
      }
      await service.update(
        {
          student_id: submission.student_id,
          question_id: submission.question_id,
          submission_time: submission.submission_time,
        },
        submission,
      );
    };

    this.queueService.addTask(task);

    return submission;
  }

  private async createStudentIfNotExist(studentDto: StudentDto) {
    const student = await this.studentService.findByKey(studentDto.id);
    if (student == null) {
      await this.studentService.create(studentDto);
    }
  }
}
