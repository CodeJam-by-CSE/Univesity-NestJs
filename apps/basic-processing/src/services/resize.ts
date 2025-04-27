/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResizeService {
  @MessagePattern({ cmd: 'resize_image' })
  async resize(data: { imagePath: string; width: number; height: number }) {
    try {
      const { imagePath, width, height } = data;

      if (!fs.existsSync(imagePath)) {
        throw new Error('File does not exist');
      }

      const outputDir = path.join(process.cwd(), 'apps/basic-processing/output_images');
      const outputFileName = 'resized_image.png';
      const outputFilePath = path.join(outputDir, outputFileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const inputImage = await fs.promises.readFile(imagePath);
      const { data: inputBuffer, info: inputInfo } = await sharp(inputImage).raw().toBuffer({ resolveWithObject: true });

      const resizedBuffer = this.bilinearInterpolation(inputBuffer, inputInfo.width, inputInfo.height, width, height);

      // Save the resized image
      await sharp(resizedBuffer, {
        raw: {
          width: width,
          height: height,
          channels: inputInfo.channels,
        },
      })
        .png()
        .toFile(outputFilePath);

      return {
        success: true,
        message: 'Image resized successfully',
        savedImagePath: outputFilePath,
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private bilinearInterpolation(
    inputBuffer: Buffer,
    inputWidth: number,
    inputHeight: number,
    outputWidth: number,
    outputHeight: number
  ): Buffer {
    const outputBuffer = Buffer.alloc(outputWidth * outputHeight * 3);

    for (let y = 0; y < outputHeight; y++) {
      for (let x = 0; x < outputWidth; x++) {
        const gx = (x / outputWidth) * (inputWidth - 1);
        const gy = (y / outputHeight) * (inputHeight - 1);

        const x0 = Math.floor(gx);
        const x1 = Math.min(x0 + 1, inputWidth - 1);
        const y0 = Math.floor(gy);
        const y1 = Math.min(y0 + 1, inputHeight - 1);

        const dx = gx - x0;
        const dy = gy - y0;

        for (let c = 0; c < 3; c++) {
          const topLeft = inputBuffer[(y0 * inputWidth + x0) * 3 + c];
          const topRight = inputBuffer[(y0 * inputWidth + x1) * 3 + c];
          const bottomLeft = inputBuffer[(y1 * inputWidth + x0) * 3 + c];
          const bottomRight = inputBuffer[(y1 * inputWidth + x1) * 3 + c];

          const top = topLeft + dx * (topRight - topLeft);
          const bottom = bottomLeft + dx * (bottomRight - bottomLeft);
          const value = top + dy * (bottom - top);

          outputBuffer[(y * outputWidth + x) * 3 + c] = Math.round(value);
        }
      }
    }

    return outputBuffer;
  }
}