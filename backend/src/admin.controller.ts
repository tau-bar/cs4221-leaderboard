import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { SUBMISSION_STATUS } from './submission/constants/submission.constant';
import { SubmitDto } from './admin.dto';
import { SubmissionDto } from './submission/dto/submission.dto';

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("submission")
  async getSubmission(
    @Query("student_id") student_id: number,
    @Query("question_id") question_id: number,
    @Query("submission_time") submission_time: Date
  ): Promise<SubmissionDto> {
    return await this.adminService.getSubmission({
      student_id: student_id,
      question_id: question_id,
      submission_time: submission_time
    });
  }

  @Get("submissions")
  async getAllSubmissions(
    @Query("student_id") student_id: number,
    @Query("question_id") question_id: number
  ): Promise<SubmissionDto[]> {
    return await this.adminService.getAllSubmissions(student_id, question_id);
  }

  @Post("submit")
  async submit(
    @Body("student_id") student_id: number,
    @Body("question_id") question_id: number,
    @Body("query") query: string
  ): Promise<SubmitDto> {
    const submission = await this.adminService.queueSubmissionEvaluation({
      student_id: student_id,
      question_id: question_id,
      is_correct: false,
      planning_time: 0.00,
      execution_time: 0.00,
      query: query,
      status: SUBMISSION_STATUS.PENDING
    });

    return {
      student_id: submission.student_id,
      question_id: submission.question_id,
      submission_time: submission.submission_time,
      query: submission.query,
      status: submission.status
    }
  }

  @Post('setup')
  async setup(
    @Body("name") name: string,
    @Body("question_schema") question_schema: string,
    @Body("question_data") question_data: string
  ): Promise<void> {
    this.adminService.setupQuestion(name, question_schema, question_data);
  }
}
