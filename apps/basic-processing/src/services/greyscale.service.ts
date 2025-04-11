/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class GreyscaleService {
  async convert(image: string) {
    try {
      const imageBuffer = Buffer.from(image, 'base64');

      const greyscaleBuffer = await sharp(imageBuffer)
        .greyscale()
        .toBuffer();

      return {
        success: true,
        data: greyscaleBuffer.toString('base64'),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}