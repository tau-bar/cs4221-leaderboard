import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question], "admin"),
  ],
  providers: [QuestionService],
  exports: [QuestionService]
})
export class QuestionModule {}
