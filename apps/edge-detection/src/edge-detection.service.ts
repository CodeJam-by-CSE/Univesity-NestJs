import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EdgeDetectionService {

  @MessagePattern({ cmd: 'detect_edge' })
  async detectEdge(filePath: string) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('File does not exist');
      }

      const outputDir = "/apps/edge-detection/output_images";
      const outputFileName = 'processed_image.png';
      const outputFilePath = path.join(outputDir, outputFileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const { grayBuffer, width, height } = await this.rgbToGrayscale(filePath);

      // Define the edge detection kernel
      const kernel = [
        -1, -1, -1,
        -1, 8, -1,
        -1, -1, -1,
      ];

      // Perform convolution manually
      const edgeBuffer = this.applyConvolution(grayBuffer, width, height, kernel);

      // Save the result as PNG
      await sharp(edgeBuffer, {
        raw: {
          width,
          height,
          channels: 1,
        },
      }).png().toFile(outputFilePath);

      return {
        success: true,
        message: 'Edge detection completed and saved to file',
        savedImagePath: outputFilePath,
      };
    } catch (error) {
      console.error('Edge detection error:', error);
      return {
        success: false,
        message: 'Failed to process local image',
        error: error.message,
      };
    }
  }

  // Convert RGB to grayscale manually
  private async rgbToGrayscale(filePath: string): Promise<{ grayBuffer: Buffer, width: number, height: number }> {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    const rawData = await image.raw().toBuffer();

    const grayBuffer = Buffer.alloc(width! * height!);
    for (let i = 0; i < rawData.length; i += 3) {
      const r = rawData[i];
      const g = rawData[i + 1];
      const b = rawData[i + 2];
      grayBuffer[i / 3] = Math.round(0.3 * r + 0.59 * g + 0.11 * b);
    }

    return { grayBuffer, width: width!, height: height! };
  }

  // Manual convolution function
  private applyConvolution(
    input: Buffer,
    width: number,
    height: number,
    kernel: number[],
  ): Buffer {
    const output = Buffer.alloc(width * height);
    const kSize = 3;
    const offset = Math.floor(kSize / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;

        for (let ky = -offset; ky <= offset; ky++) {
          for (let kx = -offset; kx <= offset; kx++) {
            const px = x + kx;
            const py = y + ky;

            // Check bounds
            if (px >= 0 && px < width && py >= 0 && py < height) {
              const pixel = input[py * width + px];
              const kernelValue = kernel[(ky + offset) * kSize + (kx + offset)];
              sum += pixel * kernelValue;
            }
          }
        }

        // Clamp value between 0 and 255
        sum = Math.min(Math.max(sum, 0), 255);
        output[y * width + x] = sum;
      }
    }

    return output;
  }
}
