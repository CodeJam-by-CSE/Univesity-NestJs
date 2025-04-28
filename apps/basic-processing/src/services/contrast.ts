/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ContrastService {
  private applyContrast(imageData: Buffer, width: number, height: number, channels: number, factor: number): Buffer {
    const result = Buffer.alloc(imageData.length);

    // Standard midpoint value for 8-bit images
    const mean = 128;

    // Adjustment formula for contrast
    const adjustment = (259 * (factor + 255)) / (255 * (259 - factor));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < channels; c++) {
          const pixelIndex = (y * width + x) * channels + c;
          if (pixelIndex >= imageData.length) continue;

          const pixel = imageData[pixelIndex];

          // Correct contrast adjustment
          const newValue = Math.round(adjustment * (pixel - mean) + mean);

          result[pixelIndex] = Math.min(Math.max(newValue, 0), 255);
        }
      }
    }
    return result;
  }

  @MessagePattern({ cmd: 'adjust_contrast' })
  async adjust(data: { imagePath: string; factor: number }) {
    try {
      const { imagePath, factor } = data;

      if (!fs.existsSync(imagePath)) {
        throw new Error('File not accessible');
      }

      const outputDir = path.join(process.cwd(), 'apps/basic-processing/output_images/');
      const outputFileName = `contrast_${factor}_image.png`;
      const outputFilePath = path.join(outputDir, outputFileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true }); // <- fixed
      }

      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const { width, height } = metadata;

      if (!width || !height) {
        throw new Error('Image dimensions could not be determined');
      }

      const channels = 4; // RGBA
      const rawData = await image
        .ensureAlpha()
        .raw()
        .toBuffer();

      const contrastedBuffer = this.applyContrast(rawData, width, height, channels, factor);

      await sharp(contrastedBuffer, {
        raw: {
          width: width,
          height: height,
          channels: channels,
        }
      })
        .png()
        .toFile(outputFilePath);

      return {
        success: true,
        message: 'Contrast adjustment completed',
        savedImagePath: outputFilePath,
      };
    } catch (error) {
      console.error('Adjustment Error:', error);
      return {
        success: false,
        message: 'Failed to adjust contrast properly',
        error: error.message,
      };
    }
  }
}
