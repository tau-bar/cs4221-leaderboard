import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission } from './entities/submission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission, "admin") private readonly submissionRepository: Repository<Submission>
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    return await this.submissionRepository.save(createSubmissionDto);
  }

  async findAll(): Promise<Submission[]> {
    return await this.submissionRepository.find();
  }

  async findOne(student_id: number, question_id: number): Promise<Submission> {
    return await this.submissionRepository.findOne({
      where: {
        student_id: student_id,
        question_id: question_id
      }
    });
  }

  async update(id: number, updateSubmissionDto: UpdateSubmissionDto): Promise<Submission> {
    return await this.submissionRepository.save(updateSubmissionDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.submissionRepository.delete(id);
  }
}
