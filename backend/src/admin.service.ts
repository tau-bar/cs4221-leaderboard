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

@Injectable()
export class AdminService {
  constructor(
    @InjectDataSource("admin") private readonly adminDataSource: DataSource,
    @InjectDataSource("participant") private readonly participantDataSource: DataSource,
    private readonly queueService: QueueService,
    private readonly questionService: QuestionService,
    private readonly studentService: StudentService,
    private readonly submissionService: SubmissionService
  ) { }

  async setupQuestion(schema_name: string, question_schema: string, question_data: string): Promise<void> {
    const queryRunner = this.adminDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`CREATE SCHEMA ${schema_name}`);
    await queryRunner.query(`alter default privileges for role ${process.env.ADMIN_USERNAME} in schema ${schema_name} grant select on tables to ${process.env.PARTICIPANT_USERNAME};`);
    await queryRunner.query(`SET LOCAL SEARCH_PATH=${schema_name}`);
    await queryRunner.query(question_schema);
    await queryRunner.query(question_data);
    await queryRunner.query(`SET LOCAL SEARCH_PATH=public`);
    await queryRunner.release();
  }

  async getSubmission(key: SubmissionKeyDto): Promise<SubmissionDto> {
    return this.submissionService.findByKey(key);
  }

  async queueSubmissionEvaluation(createSubmissionDto: CreateSubmissionDto): Promise<SubmissionDto> {
    const submission = await this.submissionService.create(createSubmissionDto);
    const question = await this.questionService.findByKey(submission.question_id);
    const resetStatRunner = this.adminDataSource.createQueryRunner();
    const queryRunner = this.participantDataSource.createQueryRunner();
    const service = this.submissionService;
    
    const task = async function (cb: QueueWorkerCallback) {
      var result = [];
      var analysis = null;
      try {
        // admin permissions required to reset pg stat tables
        await resetStatRunner.connect();
        // reset pg_stat tables
        await resetStatRunner.query("SELECT pg_stat_reset();")
        await resetStatRunner.release();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        // set statement timeout for transaction
        await queryRunner.query(`SET LOCAL SEARCH_PATH = ${question.schema_name}`)
        await queryRunner.query(`SET LOCAL statement_timeout='${question.max_timeout}ms';`);
        // get query plan
        analysis = await queryRunner.query(`EXPLAIN ANALYZE ${submission.query}`);
        // get query results
        result = await queryRunner.query(submission.query);
        await queryRunner.commitTransaction();
        await queryRunner.release();
      } catch (error) {
        cb(error);
        throw error;
      }

      // parse planning and execution time from query plan
      if (analysis != null) {
        submission.planning_time = parseFloat(analysis[1]["QUERY PLAN"].substring(15, 20));
        submission.execution_time = parseFloat(analysis[2]["QUERY PLAN"].substring(16, 21));
      }

      let is_correct = false;
      // verify correctness of query
      for (let i = 0; i < result.length; i++) {
        const actual_row = result[i];
        const expected_row = question.answer_data[i];
        const keys = Object.keys(expected_row);
        let is_row_correct = true;
        for (let key of keys) {
          // if key in expected row is not in actual row or the value is different
          if (!actual_row.hasOwnProperty(key) || actual_row[key] !== expected_row[key]) {
            is_row_correct = false;
            break;
          }
        }
        if (!is_row_correct) {
          is_correct = false;
          break;
        }
      }

      if (is_correct) {
        submission.is_correct = true;
      }

      cb(null, { submission });
    }

    // timeout here is different from the statement timeout
    // this timeout refers to the timeout for the queue task, NOT for the query execution
    // 5 is arbitrary, but should be enough to handle most evaluation cases
    task.timeout = question.max_timeout * 5;

    // handleSuccess, handleError, and handleTimeout are callback functions that are called when the task is done
    task.handleSuccess = async function (result: any) {
      const submission = result.submission;
      submission.status = SUBMISSION_STATUS.COMPLETED;
      await service.update(
        { student_id: submission.student_id, question_id: submission.question_id, submission_time: submission.submission_time },
        submission
      );
    }

    task.handleTimeout = async function () {
      submission.status = SUBMISSION_STATUS.FAILED;
      await service.update(
        { student_id: submission.student_id, question_id: submission.question_id, submission_time: submission.submission_time }, 
        submission
      );
    }

    task.handleError = async function (err: Error) {
      // recognize statement timeout error
      if (err.message === "canceling statement due to statement timeout") {
        submission.status = SUBMISSION_STATUS.TIMEOUT;
      } else {
        submission.status = SUBMISSION_STATUS.FAILED;
      }
      await service.update(
        { student_id: submission.student_id, question_id: submission.question_id, submission_time: submission.submission_time },
        submission
      );
    }
    
    this.queueService.addTask(task)

    return submission;
  }
}
