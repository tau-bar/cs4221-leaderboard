import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectDataSource('admin') private readonly dataSource: DataSource,
    @InjectRepository(Question, 'admin')
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    return await this.questionRepository.save(createQuestionDto);
  }

  async findAll(): Promise<Question[]> {
    return await this.questionRepository.find();
  }

  async getList(page: number, limit: number): Promise<Question[]> {
    return await this.questionRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByKey(id: number): Promise<Question> {
    return await this.questionRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<UpdateResult> {
    return await this.questionRepository.update(id, updateQuestionDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.questionRepository.delete(id);
  }

  async getQuestionCount(): Promise<number> {
    return await this.questionRepository.count();
  }
}
