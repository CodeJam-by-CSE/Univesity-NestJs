/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { convertToGreyscale } from '../../../common/utils/greyscale';

@Injectable()
export class GreyscaleService {
  async saveGreyscaleImage(
    imagePath: string,
    filename: string = 'greyscale_image.png'
  ): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        throw new Error('File does not exist');
      }

      // Convert to greyscale using the utility function
      const result = await convertToGreyscale(imagePath);

      // Create output directory
      const outputDir = path.join(process.cwd(), 'apps/basic-processing/output_images');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Ensure filename has .png extension
      const outputFilename = filename.endsWith('.png') ? filename : `${filename}.png`;
      const outputPath = path.join(outputDir, outputFilename);

      // Save using sharp
      await sharp(result.buffer, {
        raw: {
          width: result.width,
          height: result.height,
          channels: 3
        }
      })
        .png()
        .toFile(outputPath);

      return {
        success: true,
        filePath: outputPath
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}