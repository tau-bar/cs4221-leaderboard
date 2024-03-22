import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SubmissionService } from './submission/submission.service';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectDataSource("participant") private readonly participantDataSource: DataSource,
    private readonly submissionService: SubmissionService
  ) {}

  async submitQuery(query: string): Promise<string> {
    const queryRunner = this.participantDataSource.createQueryRunner();
    await queryRunner.connect();
    const result = await queryRunner.query(query);
    await queryRunner.release();
    return JSON.stringify(result);
  }
}