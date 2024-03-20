import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student, "admin") private readonly studentRepository: Repository<Student>
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    return await this.studentRepository.save(createStudentDto);
  }

  async findAll(): Promise<Student[]>{
    return await this.studentRepository.find();
  }

  async findOne(id: number): Promise<Student> {
    return await this.studentRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    return await this.studentRepository.save(updateStudentDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.studentRepository.delete(id);
  }
}
