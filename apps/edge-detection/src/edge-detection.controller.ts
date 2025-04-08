import { Controller, Get } from '@nestjs/common';
import { EdgeDetectionService } from './edge-detection.service';

@Controller()
export class EdgeDetectionController {
  constructor(private readonly edgeDetectionService: EdgeDetectionService) {}

  @Get()
  getHello(): string {
    return this.edgeDetectionService.getHello();
  }
}
