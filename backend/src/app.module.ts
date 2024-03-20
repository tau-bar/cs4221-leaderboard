import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { QuestionModule } from './question/question.module';
import { StudentModule } from './student/student.module';
import { SubmissionModule } from './submission/submission.module';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import 'dotenv/config';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    DatabaseModule,
    QuestionModule,
    StudentModule,
    SubmissionModule
  ],
  controllers: [AdminController, ParticipantController],
  providers: [AdminService, ParticipantService]
})
export class AppModule {}
