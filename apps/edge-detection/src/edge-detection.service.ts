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
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('File does not exist');
      }

      // Generate output file path
      const outputDir = "/home/aravinda/Aravinda's File/ACA/Z-Other/CSE40/cse40/apps/edge-detection/output_images";
      const outputFileName = 'processed_image.png'; // You can also generate dynamic filenames if needed
      const outputFilePath = path.join(outputDir, outputFileName);

      // Ensure the output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Process the image using sharp
      const image = sharp(filePath).greyscale();

      const edgeKernel = {
        width: 3,
        height: 3,
        kernel: [
          -1, -1, -1,
          -1, 8, -1,
          -1, -1, -1,
        ],
      };

      // Apply edge detection and save to output file path
      await image
        .convolve(edgeKernel)
        .png()
        .toFile(outputFilePath);  // Save to disk

      // Return success message with the output path
      return {
        success: true,
        message: 'Edge detection completed and saved to file',
        savedImagePath: outputFilePath,  // Return the saved file path
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
}
