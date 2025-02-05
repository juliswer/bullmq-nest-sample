import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('post')
  async post(@Body() body: { message: string; deadline: string }) {
    const deadline = new Date(body.deadline);

    return this.appService.processPost({
      message: body.message,
      deadline: deadline,
    });
  }
}
