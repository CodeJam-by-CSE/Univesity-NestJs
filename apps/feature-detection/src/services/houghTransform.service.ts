import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { convertToGreyscale } from '../../../common/utils/greyscale';

@Injectable()
export class HoughTransformService {
  @MessagePattern({ cmd: 'hough_transform' })
  async detectLines(imagePath: string) {
    try {
      if (!fs.existsSync(imagePath)) {
        throw new Error('File does not exist');
      }

      const outputDir = path.join(process.cwd(), 'apps/feature-detection/output_images');
      const outputFileName = 'hough_output.png';
      const outputFilePath = path.join(outputDir, outputFileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const { buffer: raw, width, height } = await convertToGreyscale(imagePath);

      // 1. Apply Sobel Edge Detection
      const edgeBuffer = this.sobelEdgeDetection(raw, width, height);

      // 2. Hough Transform accumulator
      const angleStep = 1;
      const thetaBins = Math.floor(180 / angleStep);
      const diagLen = Math.ceil(Math.sqrt(width * width + height * height));
      const rhoBins = diagLen * 2;

      const accumulator = Array.from({ length: rhoBins }, () => new Array(thetaBins).fill(0));
      const centerX = width / 2;
      const centerY = height / 2;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = y * width + x;
          if (edgeBuffer[i] > 200) { // Edge pixel
            for (let t = 0; t < thetaBins; t++) {
              const theta = (t * angleStep) * (Math.PI / 180);
              const rho = Math.round(x * Math.cos(theta) + y * Math.sin(theta)) + diagLen;
              accumulator[rho][t]++;
            }
          }
        }
      }

      // 3. Threshold accumulator to find lines
      const threshold = 100;
      const lines: { rho: number; theta: number }[] = [];

      for (let r = 0; r < rhoBins; r++) {
        for (let t = 0; t < thetaBins; t++) {
          if (accumulator[r][t] > threshold) {
            lines.push({ rho: r - diagLen, theta: t * angleStep });
          }
        }
      }

      console.log(`Detected ${lines.length} lines`);

      // Optional: You can draw these lines later if you want using math and Sharp

      return {
        success: true,
        message: 'Hough Transform line detection complete',
        linesDetected: lines.length,
        lines,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private sobelEdgeDetection(data: Buffer, width: number, height: number): Buffer {
    const Gx = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];
    const Gy = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ];

    const output = Buffer.alloc(width * height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sumX = 0;
        let sumY = 0;

        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            const pixel = data[(y + j) * width + (x + i)];
            sumX += pixel * Gx[j + 1][i + 1];
            sumY += pixel * Gy[j + 1][i + 1];
          }
        }

        const magnitude = Math.sqrt(sumX * sumX + sumY * sumY);
        output[y * width + x] = Math.min(255, Math.round(magnitude));
      }
    }

    return output;
  }
}
