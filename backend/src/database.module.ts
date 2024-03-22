import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question/entities/question.entity';
import { Student } from './student/entities/student.entity';
import { Submission } from './submission/entities/submission.entity';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: "admin",
      type: "postgres",
      url: `postgres://${process.env.ADMIN_USERNAME}.apbjycsgbzmzyabmeuob:${process.env.ADMIN_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:${process.env.DATABASE_PORT}/postgres`,
      synchronize: false,
      entities: [Question, Student, Submission],
      logging: true
    }),
    TypeOrmModule.forRoot({
      name: "participant",
      type: "postgres",
      url: `postgres://${process.env.PARTICIPANT_USERNAME}.apbjycsgbzmzyabmeuob:${process.env.PARTICIPANT_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:${process.env.DATABASE_PORT}/postgres`,
      synchronize: false,
      entities: [],
      logging: true
    }),
  ]
})
export class DatabaseModule {}