/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ContrastService {
  async adjust(data: { image: string; factor: number }) {
    try {
      const { image, factor } = data;
      const imageBuffer = Buffer.from(image, 'base64');

      const contrastedBuffer = await sharp(imageBuffer)
        .linear(factor, -(128 * factor) + 128)
        .toBuffer();

      return {
        success: true,
        data: contrastedBuffer.toString('base64'),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}