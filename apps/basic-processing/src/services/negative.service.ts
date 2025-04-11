/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NegativeService {
  // Kernel for negative effect
  private readonly kernel = [
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1]
  ];

  private applyConvolution(imageData: Buffer, width: number, height: number, channels: number): Buffer {
    const result = Buffer.alloc(imageData.length);
    const bias = 255; // Bias to invert the image

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < channels; c++) {
          const pixelIndex = (y * width + x) * channels + c;
          let sum = 0;

          // Apply kernel convolution
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const px = Math.min(Math.max(x + kx, 0), width - 1);
              const py = Math.min(Math.max(y + ky, 0), height - 1);
              const kernelValue = this.kernel[ky + 1][kx + 1];
              const sourceIndex = (py * width + px) * channels + c;
              sum += imageData[sourceIndex] * kernelValue;
            }
          }

          // Apply bias to invert the color
          result[pixelIndex] = Math.min(Math.max(bias + sum, 0), 255);
        }
      }
    }
    return result;
  }
  @MessagePattern({ cmd: 'create_negative' })
  async createNegative(filePath: string) {
      try {
        if (!fs.existsSync(filePath)) {
          throw new Error('File does not exist');
        }
  
        const outputDir = path.join(process.cwd(), 'apps/basic-processing/output_images');
        const outputFileName = 'negative_image.png';
        const outputFilePath = path.join(outputDir, outputFileName);
  
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
  
        const image = sharp(filePath);
        const metadata = await image.metadata();
        const { width, height } = metadata;
        const channels = 3;
  
        const rawData = await image.raw().toBuffer();
        
        const negativeBuffer = this.applyConvolution(rawData, width!, height!, channels);
  
        // Save the negative image
        await sharp(negativeBuffer, {
          raw: {
            width: width!,
            height: height!,
            channels: channels
          }
        })
        .png()
        .toFile(outputFilePath);
  
        return {
          success: true,
          message: 'Negative image created using convolution method',
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