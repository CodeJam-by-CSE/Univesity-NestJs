import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MessagePattern } from '@nestjs/microservices';
import { Queue } from 'queue-typescript';

@Injectable()
export class FloodFillService {
  @MessagePattern({ cmd: 'flood_fill' })
  async floodFillImage(imagePath: string, sr: number, sc: number, newColor: number) {
    try {
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        throw new Error('File does not exist');
      }

      // Directory for output image
      const outputDir = path.join(process.cwd(), 'apps/enhancement/output_images');
      const outputFileName = 'flood_filled.jpg';
      const outputFilePath = path.join(outputDir, outputFileName);

      // Create output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Load the image (you can use a library like sharp for this, but for simplicity, we'll assume a pixel-based approach)
      const image = await this.loadImage(imagePath);

      // Validate start coordinates and image size
      const oldColor = image[sr][sc];
      if (oldColor === newColor) {
        return {
          success: false,
          message: 'Starting pixel already has the new color',
        };
      }

      // Perform flood fill (BFS or DFS)
      this.floodFill(image, sr, sc, oldColor, newColor);

      // Save the processed image
      await this.saveImage(image, outputFilePath);

      return {
        success: true,
        message: 'Flood fill complete',
        savedImagePath: outputFilePath,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private floodFill(image: number[][], sr: number, sc: number, oldColor: number, newColor: number) {
    const rows = image.length;
    const cols = image[0].length;

    // Initialize queue for BFS (can replace with DFS if needed)
    const queue = new Queue<[number, number]>();
    queue.enqueue([sr, sc]);

    // Directions for moving up, down, left, right
    const directions: [number, number][] = [
      [1, 0], // down
      [-1, 0], // up
      [0, 1], // right
      [0, -1], // left
    ];

    // Change the color of the starting pixel
    image[sr][sc] = newColor;

    // Perform BFS
    while (queue.length > 0) {
      const [x, y] = queue.dequeue()!;

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        // Ensure the new coordinates are valid and match the old color
        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && image[nx][ny] === oldColor) {
          image[nx][ny] = newColor;
          queue.enqueue([nx, ny]);
        }
      }
    }
  }

  private async loadImage(imagePath: string): Promise<number[][]> {
    // Simulating image loading (this part can be replaced with a real image processing library like sharp)
    // For the sake of this example, we're returning a mock image
    return [
      [1, 1, 1, 0],
      [0, 1, 1, 1],
      [1, 0, 1, 1],
    ];
  }

  private async saveImage(image: number[][], outputFilePath: string): Promise<void> {
    // This is a simplified version, you could use sharp or any other image library to save the image
    // As an example, we just log the output file path
    console.log('Image saved at:', outputFilePath);
  }
}
