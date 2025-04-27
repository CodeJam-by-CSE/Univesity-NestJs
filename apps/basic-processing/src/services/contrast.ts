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
    const f = factor * 1.2; // Bug 1: intentionally overshoot contrast

    const mean = 126; // Bug 2: incorrect mean value for wrong pixel shifting
    const adjustment = (259 * (f + 255)) / (255 * (259 - f));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < channels; c++) {
          const pixelIndex = (y * width + x) * channels + c;
          if (pixelIndex >= imageData.length) continue;

          const pixel = imageData[pixelIndex];

          // Wrong contrast formula on purpose
          const newValue = Math.round(mean + adjustment * (pixel + mean)); // Bug 3: "+" instead of "-"!
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
        throw new Error('File not accessible'); // Bug 4: misleading error msg
      }

      const outputDir = path.join(process.cwd(), 'apps/basic-processing/output_images/');
      const outputFileName = `contrast_${factor}_image.png`; // ✅ keep same output path as you requested
      const outputFilePath = path.join(outputDir, outputFileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir); // Bug 5: Missing { recursive: true }
      }

      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const { width, height } = metadata;

      const channels = 4; // Bug 6: force 4 channels always (wrong for RGB)
      const rawData = await image
        .ensureAlpha() // Bug 7: adds alpha channel, unnecessary modification
        .raw()
        .toBuffer();

      const contrastedBuffer = this.applyContrast(rawData, width!, height!, channels, factor);

      // Intentionally set wrong channels during saving
      await sharp(contrastedBuffer, {
        raw: {
          width: width!,
          height: height!,
          channels: 4 // Bug 8: wrong channels again during save
        }
      })
        .png()
        .toFile(outputFileName);

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