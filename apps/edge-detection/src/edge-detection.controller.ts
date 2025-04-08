import { Controller, Get, Post } from '@nestjs/common';
import { EdgeDetectionService } from './edge-detection.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class EdgeDetectionController {
  constructor(private readonly edgeDetectionService: EdgeDetectionService) { }

  @EventPattern('detect_edge')
  async handleDetectEdge(imageBase64: string) {
    console.log('Received image for edge detection');
    return await this.edgeDetectionService.detectEdge(imageBase64);
  }

}
