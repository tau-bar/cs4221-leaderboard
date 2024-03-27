import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './question.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question], 'admin')],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
