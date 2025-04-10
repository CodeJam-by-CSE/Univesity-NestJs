/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { NegativeImageService } from './negative-image.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class NegativeImageController {
  constructor(private readonly negativeImageService: NegativeImageService) {}

  @EventPattern('create_negative')
  async handleCreateNegative(imagePath: string) {
    console.log('Received image for negative creation');
    return await this.negativeImageService.createNegative(imagePath);
  }
}