import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('setup')
  async setup(
    @Body("name") name: string,
    @Body("question_schema") question_schema: string,
    @Body("question_data") question_data: string
  ): Promise<void> {
    this.adminService.setupQuestion(name, question_schema, question_data);
  }
}
