/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ResizeService {
  async resize(data: { image: string; width: number; height: number }) {
    try {
      const { image, width, height } = data;
      const imageBuffer = Buffer.from(image, 'base64');

      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(width, height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toBuffer();

      return {
        success: true,
        data: resizedImageBuffer.toString('base64'),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}