/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { BasicProcessingService } from './basic-processing.service';

@Controller()
export class BasicProcessingController {
  constructor(private readonly basicProcessingService: BasicProcessingService) {}

  @EventPattern({ cmd: 'resize_image' })
  async handleResize(data: { image: string; width: number; height: number }) {
    console.log('Received image for resizing');
    return await this.basicProcessingService.resizeImage(data);
  }

  @EventPattern({ cmd: 'convert_greyscale' })
  async handleGreyscale(image: string) {
    console.log('Received image for greyscale conversion');
    return await this.basicProcessingService.convertToGreyscale(image);
  }

  @EventPattern({ cmd: 'adjust_contrast' })
  async handleContrast(data: { image: string; factor: number }) {
    console.log('Received image for contrast adjustment');
    return await this.basicProcessingService.adjustContrast(data);
  }

  @EventPattern({ cmd: 'create_negative' })
  async handleNegative(image: string) {
    console.log('Received image for negative creation');
    return await this.basicProcessingService.createNegative(image);
  }
}
