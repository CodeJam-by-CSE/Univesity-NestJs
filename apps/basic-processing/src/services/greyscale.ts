/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class GreyscaleService {
  convert(imageBase64: string): { success: boolean; data?: string; error?: string } {
    try {
      const buffer = Buffer.from(imageBase64, 'base64');

      const greyscaleBuffer = Buffer.alloc(buffer.length);

      for (let i = 0; i < buffer.length; i += 4) {
        const r = buffer[i];
        const g = buffer[i + 1];
        const b = buffer[i + 2];
        const a = buffer[i + 3]; // Alpha

        // Greyscale value using luminance formula
        const grey = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

        greyscaleBuffer[i] = grey;
        greyscaleBuffer[i + 1] = grey;
        greyscaleBuffer[i + 2] = grey;
        greyscaleBuffer[i + 3] = a; // Keep original alpha
      }

      return {
        success: true,
        data: greyscaleBuffer.toString('base64'),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
