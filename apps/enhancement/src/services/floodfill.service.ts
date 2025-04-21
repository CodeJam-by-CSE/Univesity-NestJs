import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { convertToGreyscale } from '../../../common/utils/greyscale';

@Injectable()
export class FloodFillService {
  @MessagePattern({ cmd: 'flood_fill' })
  async floodFill(data: { imagePath: string; sr: number; sc: number; newColor: number }) {
    const { imagePath, sr, sc, newColor } = data;

    if (!fs.existsSync(imagePath)) {
      throw new Error('File does not exist');
    }

    const outputDir = path.join(process.cwd(), 'apps/enhancement/output_images');
    const outputFileName = 'flood_filled.png';
    const outputFilePath = path.join(outputDir, outputFileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const { buffer: raw, width, height } = await convertToGreyscale(imagePath);
    const image: number[][] = [];

    // Convert raw 1D buffer to 2D array
    for (let i = 0; i < height; i++) {
      image[i] = [];
      for (let j = 0; j < width; j++) {
        image[i][j] = raw[i * width + j];
      }
    }

    const originalColor = image[sr][sc];
    if (originalColor === newColor) return;

    const dfs = (x: number, y: number) => {
      if (x < 0 || y < 0 || x >= height || y >= width) return;
      if (image[x][y] !== originalColor) return;

      image[x][y] = newColor;

      dfs(x + 1, y);
      dfs(x - 1, y);
      dfs(x, y + 1);
      dfs(x, y - 1);
    };

    dfs(sr, sc);

    // Convert 2D back to 1D buffer
    const resultBuffer = Buffer.alloc(width * height);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        resultBuffer[i * width + j] = image[i][j];
      }
    }

    await sharp(resultBuffer, {
      raw: { width, height, channels: 1 },
    })
      .toFile(outputFilePath);

    return { outputFilePath };
  }
}
