import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Submission], 'admin')],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
