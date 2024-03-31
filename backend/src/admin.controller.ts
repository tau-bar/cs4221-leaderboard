import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { SubmitDto, SubmitResponseDto } from './admin.dto';
import { SubmissionDto } from './submission/dto/submission.dto';
import { SUBMISSION_STATUS } from './submission/constants/submission.constant';
import { LeaderboardDTO } from './submission/dto/leaderboard.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('submission')
  async getSubmission(
    @Query('student_id') student_id: string,
    @Query('question_id') question_id: number,
    @Query('submission_time') submission_time: Date,
  ): Promise<SubmissionDto> {
    return await this.adminService.getSubmission({
      student_id: student_id,
      question_id: question_id,
      submission_time: submission_time,
    });
  }

  @Get('submissions')
  async getAllSubmissions(
    @Query('student_id') student_id: string,
    @Query('question_id') question_id: number,
  ): Promise<SubmissionDto[]> {
    return await this.adminService.getAllSubmissions(student_id, question_id);
  }

  @Get('correct-submissions')
  async getAllCorrectSubmissions(
    @Query('student_id') student_id: string,
    @Query('question_id') question_id: number,
  ): Promise<SubmissionDto[]> {
    return await this.adminService.getAllCorrectSubmissions(
      student_id,
      question_id,
    );
  }

  @Get('leaderboard')
  async getLeaderboard(
    @Query('student_id') student_id: string,
    @Query('question_id') question_id: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<LeaderboardDTO> {
    return await this.adminService.getLeaderboard(
      student_id,
      question_id,
      page,
      size,
    );
  }

  @Post('submit')
  async submit(@Body() submitDto: SubmitDto): Promise<SubmissionDto> {
    return await this.adminService.queueSubmissionEvaluation(
      {
        id: submitDto.student_id,
        name: submitDto.student_name,
        email: submitDto.student_email,
      },
      {
        student_id: submitDto.student_id,
        question_id: submitDto.question_id,
        is_correct: false,
        planning_time: 0.0,
        execution_time: 0.0,
        query: submitDto.query,
        status: SUBMISSION_STATUS.PENDING,
      },
    );
  }

  @Post('setup')
  async setup(
    @Body('name') name: string,
    @Body('question_schema') question_schema: string,
    @Body('question_data') question_data: string,
  ): Promise<void> {
    this.adminService.setupQuestion(name, question_schema, question_data);
  }
}
