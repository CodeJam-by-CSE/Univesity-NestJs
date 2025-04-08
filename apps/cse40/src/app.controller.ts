import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('images')
export class AppController {
  constructor(private readonly mainService: AppService) { }

  @Post('detect-edge')
  async detectEdge(@Body() body: { imageBase64: string }) {
    return this.mainService.sendToEdgeService(body.imageBase64);
  }
}

