import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Get('list')
  async getQuestions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.questionService.getList(page, limit);
  }

  @Get('/count')
  async getQuestionCount() {
    return await this.questionService.getQuestionCount();
  }

  @Get(':id')
  async getQuestion(@Query('id') id: number) {
    return await this.questionService.findByKey(id);
  }

  @Get('all')
  async getAllQuestions() {
    return await this.questionService.findAll();
  }

  @Post('/create')
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      const question = await this.questionService.create(createQuestionDto);
      return { success: true, data: question };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
