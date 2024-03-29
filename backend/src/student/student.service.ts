import { Injectable } from '@nestjs/common';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { StudentDto } from './dto/student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student, "admin") private readonly studentRepository: Repository<Student>
  ) {}

  async create(studentDto: StudentDto): Promise<Student> {
    return await this.studentRepository.save(studentDto);
  }

  async findAll(): Promise<Student[]>{
    return await this.studentRepository.find();
  }

  async findByKey(id: string): Promise<Student> {
    return await this.studentRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<UpdateResult> {
    return await this.studentRepository.update(id, updateStudentDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.studentRepository.delete(id);
  }
}
