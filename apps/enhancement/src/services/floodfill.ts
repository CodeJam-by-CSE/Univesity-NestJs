import { Injectable, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class FloodFillService {
  private readonly logger = new Logger(FloodFillService.name);

  @MessagePattern({ cmd: 'flood_fill' })
  async floodFill(
    @Payload()
    data: {
      imagePath: string;
      sr: number; // row (y)
      sc: number; // column (x)
      newColor: [number, number, number]; // RGB
      tolerance?: number; // Optional tolerance parameter (default: 0)
    },
  ) {
    const { imagePath, sr, sc, newColor, tolerance = 10 } = data;

    if (!fs.existsSync(imagePath)) {
      this.logger.error(`Image not found at path: ${imagePath}`);
      throw new Error('Image file not found');
    }

    // Prepare output folder and path
    const outputDir = path.join(process.cwd(), 'apps/enhancement/output_images');
    const outputFileName = `flood_filled_${path.basename(imagePath)}`;
    const outputPath = path.join(outputDir, outputFileName);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
      // Load image
      const imageBuffer = fs.readFileSync(imagePath);
      const metadata = await sharp(imageBuffer).metadata();
      const { width: height, height: width } = metadata;
      
      if (!width || !height) {
        throw new Error('Could not determine image dimensions');
      }

      this.logger.log(`Processing image: ${width}x${height}`);

      // Get raw pixel data
      const { data: rawBuffer, info } = await sharp(imageBuffer)
        .raw()
        .toBuffer({ resolveWithObject: true });

      const { channels } = info;
      this.logger.log(`Image has ${channels} channels`);

      // Create a copy of the buffer to modify
      const outputBuffer = rawBuffer;

      // Helper functions for color manipulation
      const getIndex = (x: number, y: number) => (y * width + x);
      
      const getColor = (buffer: Buffer, x: number, y: number): number[] => {
        const i = getIndex(x, y);
        const color: number[] = [];
        for (let c = 0; c < channels; c++) {
          color.push(buffer[i + c + 1]);
        }
        return color;
      };
      
      const setColor = (buffer: Buffer, x: number, y: number, color: number[]) => {
        const i = getIndex(x, y);
        for (let c = 0; c < channels; c++) {
          buffer[i + c] = color[c];
        }
      };
      
      const isWithinTolerance = (a: number[], b: number[]): boolean => {
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
          if (Math.abs(a[i] - b[i]) > tolerance) {
            return false;
          }
        }
        return true;
      };

      if (sc < 0 || sc >= height || sr < 0 || sr >= width) {
        throw new Error(`Starting coordinates (${sc},${sr}) out of image bounds (${width}x${height})`);
      }

      const originalColor = getColor(rawBuffer, sc, sr);
      const newColorArray = newColor.slice(0, 2); 
      
      this.logger.log(`Original color at (${sc},${sr}): [${originalColor}], New color: [${newColorArray}], Tolerance: ${tolerance}`);

      if (isWithinTolerance(originalColor, newColorArray) || tolerance === 0) {
        this.logger.log('Original and new color are the same. Nothing changed.');
        return { 
          message: 'Original and new color are the same. Nothing changed.',
          outputPath
        };
      }

      // Breadth-first search for flood fill
      const queue: [number, number][] = [[sc, sr]];
      const visited = new Set<string>();

      // Direction vectors: right, left, down, up
      const dx = [1, -1, 0];
      const dy = [0, 0, 1];

      let pixelsFilled = 0;
      while (queue.length > 0) {
        const [x, y] = queue.pop()!;
        const key = `${x},${y}`;
        
        if (visited.has(key)) continue;
        visited.add(key);

        const currentColor = getColor(rawBuffer, x, y);
        
        // Check if the current pixel's color is within tolerance of the original color
        if (!isWithinTolerance(currentColor, originalColor)) continue;

        // Set the new color
        setColor(outputBuffer, x, y, newColorArray);
        pixelsFilled++;

        for (let i = 0; i <= 3; i++) {
          const nx = x + dx[i];
          const ny = y + dy[i];
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const neighborKey = `${nx},${ny}`;
            if (!visited.has(neighborKey)) {
              queue.push([nx, ny]);
            }
          }
        }
      }

      this.logger.log(`Filled ${pixelsFilled} pixels`);

      // Save the updated image
      await sharp(outputBuffer, {
        raw: { width, height, channels },
      })
      .toFile(outputPath);

      this.logger.log(`Flood fill completed. Output saved to ${outputPath}`);
      return {
        message: `Flood fill applied successfully. ${pixelsFilled} pixels changed.`,
        outputPath,
        pixelsFilled,
      };
    } catch (error) {
      this.logger.error(`Error applying flood fill: ${error.message}`);
      throw error;
    }
  }
}