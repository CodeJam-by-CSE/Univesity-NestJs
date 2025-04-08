import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import * as Jimp from 'jimp';

@Injectable()
export class EdgeDetectionService {


  async detectEdge(imageBase64: string) {
    console.log(imageBase64);
    return {
      success: true,
      message: 'Edge detection completed (fake response)',
    };
    // process image and return result
  }
}
