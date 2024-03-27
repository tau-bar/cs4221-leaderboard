import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async getQuestions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.questionService.getList(page, limit);
  }
}
