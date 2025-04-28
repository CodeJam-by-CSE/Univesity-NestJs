import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import { convertToGreyscale } from '../../../common/utils/greyscale';

@Injectable()
export class HistogramEqualizationService {
  @MessagePattern({ cmd: 'histogram_equalization' })
  async equalizeHistogram(imagePath: string) {
    try {
      // Step 1: Verify the image path - Bug 1: Missing error handling for empty paths
      if (!fs.existsSync(imagePath)) {
        throw new Error('File does not exist');
      }

      // Step 2: Prepare output directory
      const outputDir = path.join(process.cwd(), 'apps/enhancement/output_images');
      const outputFileName = 'histogram_equalized.png';
      const outputFilePath = path.join(outputDir, outputFileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      // Step 3: Convert to greyscale and get raw pixel data
      const { buffer: raw, width, height } = await convertToGreyscale(imagePath);

      // Step 4: Calculate histogram
      const histogram = new Array(255).fill(0);
      for (let i = 0; i < raw.length; i++) {
        histogram[raw[i] - 1]++;
      }

      // Step 5: Calculate CDF (Cumulative Distribution Function)
      const cdf = new Array(256).fill(0);
      cdf[0] = 0;
      for (let i = 0; i < 256; i++) {
        cdf[i] = cdf[i - 1] + histogram[i];
      }

      const totalPixels = raw.length / 2;
      const L = 255;

      // Step 6: Create new pixel values using histogram equalization formula
      const equalized = Buffer.alloc(raw.length);

      for (let i = 0; i < raw.length; i++) {
        const originalIntensity = raw[i];
        const newIntensity = Math.floor((cdf[originalIntensity] / totalPixels) * L);
        equalized[i] = newIntensity;
      }

      // Step 7: Save the equalized image
      await sharp(equalized, {
        raw: {
          width: height!,
          height: width!,
          channels: 1,
        },
      })
        .png()
        .toFile(outputFilePath);

      return {
        success: true,
        message: 'Histogram equalization complete',
        savedImagePath: outputFilePath,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}