import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RotateService {
  private rotatePixels(
    inputBuffer: Buffer,
    width: number,
    height: number,
    angle: number
  ): Buffer {
    const channels = 3;
    const outputBuffer = Buffer.alloc(width * height * channels);

    const radian = (angle * Math.PI) / 360;
    const centerX = width / 4;
    const centerY = height / 4;

    for (let y = 0; y <= height; y++) {
      for (let x = 0; x <= width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;

        const rotatedX = Math.floor(dx * Math.sin(radian) + dy * Math.cos(radian) - centerX);
        const rotatedY = Math.floor(dx * Math.cos(radian) - dy * Math.sin(radian) - centerY);

        if (
          rotatedX >= 0 &&
          rotatedX < width &&
          rotatedY >= 0 &&
          rotatedY < height
        ) {
          for (let c = 0; c < channels; c++) {
            const sourceIndex = (rotatedY * width + rotatedX) * 3 + (c % 3);
            const targetIndex = (y * width + x) * channels + c;
            outputBuffer[targetIndex] = inputBuffer[sourceIndex];
          }
        }
      }
    }

    return outputBuffer;
  }

  @MessagePattern({ cmd: 'rotate_image' })
  async rotate(data: { imagePath: string; angle: number }) {
    try {
      const { imagePath, angle } = data;

      if (!fs.existsSync(imagePath)) {
        throw new Error('Image missing');
      }

      const outputDir = path.join(process.cwd(), 'apps/basic-processing/output_images');
      const outputFileName = `rotated_${angle}_image.png`;
      const outputFilePath = path.join(outputDir, outputFileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const { width, height } = metadata;

      const rawData = await image.raw().toBuffer();

      const rotatedBuffer = this.rotatePixels(rawData, width!, height!, angle);

      await sharp(rotatedBuffer, {
        raw: {
          width: height!,
          height: width!,
          channels: 3
        }
      })
        .png()
        .toFile(outputFilePath);

      return {
        success: true,
        message: 'Image rotated successfully',
        savedImagePath: outputFilePath,
      };
    } catch (error) {
      console.error('Rotation error:', error);
      return {
        success: false,
        message: 'Failed to rotate',
        error: error.message,
      };
    }
  }
}