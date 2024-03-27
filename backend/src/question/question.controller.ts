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

  @Get(':id')
  async getQuestion(@Query('id') id: number) {
    return await this.questionService.findByKey(id);
  }

  @Get('all')
  async getAllQuestions() {
    return await this.questionService.findAll();
  }
}
