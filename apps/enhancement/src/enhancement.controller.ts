/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EnhancementService } from './enhancement.service';

@Controller()
export class EnhancementController {
  constructor(private readonly enhancementService: EnhancementService) {}

  
  @EventPattern({ cmd: 'histogram_equalization_image' })
  async handleHistogramEqualization(imagePath: string) {
    console.log('Received image for histogram equalization');
    return await this.enhancementService.histogramEqualization(imagePath);
  }

  
}
