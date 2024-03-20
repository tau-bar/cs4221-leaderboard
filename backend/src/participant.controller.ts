import { Controller, Post, Body } from '@nestjs/common';
import { ParticipantService } from './participant.service';

@Controller("participant")
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post('submit')
  async run(@Body("query") query: string): Promise<string> {
    return this.participantService.submitQuery(query);
  }
}