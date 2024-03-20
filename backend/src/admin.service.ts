import { Injectable } from '@nestjs/common';
import { QuestionService } from './question/question.service';
import { StudentService } from './student/student.service';
import { SubmissionService } from './submission/submission.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectDataSource("admin") private readonly adminDataSource: DataSource,
    @InjectDataSource("participant") private readonly participantDataSource: DataSource,
    private readonly questionService: QuestionService,
    private readonly studentService: StudentService,
    private readonly submissionService: SubmissionService
  ) {}

  async setupQuestion(question_schema: string, question_data: string): Promise<void> {
    const queryRunner = this.adminDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(question_schema);
    await queryRunner.query(question_data);
    await queryRunner.release();
  }
}
