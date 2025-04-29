/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NegativeService {
  @MessagePattern({ cmd: 'create_negative' })
  async createNegative(imagePath: string) {
    try {
      if (!fs.existsSync(imagePath)) {
        throw new Error('File does not exist');
      }

      const outputDir = path.join(process.cwd(), 'apps/basic-processing/output_images');
      const outputFileName = 'negative_image.png';
      const outputFilePath = path.join(outputDir, outputFileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const { width, height, channels = 3 } = metadata;

      if (!width || !height) {
        throw new Error('Invalid image dimensions');
      }

      // Get raw pixel data
      const rawData = await image
        .removeAlpha() // In case image has alpha, remove it to keep things simple
        .raw()
        .toBuffer();

      // Create a buffer for negative image
      const negativeBuffer = Buffer.alloc(rawData.length);

      // Invert each pixel value
      for (let i = 0; i < rawData.length; i++) {
        negativeBuffer[i] = 255 - rawData[i];
      }

      // Save the negative image
      await sharp(negativeBuffer, {
        raw: {
          width,
          height,
          channels: channels >= 3 ? 3 : channels, // Ensure we save as RGB
        }
      })
        .png()
        .toFile(outputFilePath);

      return {
        success: true,
        message: 'Negative image created successfully',
        savedImagePath: outputFilePath,
      };
    } catch (error) {
      console.error('Negative image creation error:', error);
      return {
        success: false,
        message: 'Failed to process image',
        error: error.message,
      };
    }
  }
}
