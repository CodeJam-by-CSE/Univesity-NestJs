import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SharpenService {
  // Advanced Sharpening kernel (Unsharp Masking or High-Pass Filter)
  private readonly kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0], // You can use this for basic sharpening
  ];

  // Enhanced kernels for various sharpening intensities
  private readonly enhancedKernels = {
    // Stronger edge enhancement
    strong: [
      [-1, -1, -1],
      [-1, 9, -1],
      [-1, -1, -1],
    ],
    // Subtle enhancement for detailed images
    subtle: [
      [0, -0.5, 0],
      [-0.5, 3, -0.5],
      [0, -0.5, 0],
    ],
  };

  // Function to apply convolution to the image
  private applyConvolution(imageData: Buffer, width: number, height: number, channels: number, kernelType: 'default' | 'strong' | 'subtle' = 'default'): Buffer {
    const result = Buffer.alloc(imageData.length);
    // Select kernel based on type
    const selectedKernel = 
      kernelType === 'strong' ? this.enhancedKernels.strong : 
      kernelType === 'subtle' ? this.enhancedKernels.subtle : 
      this.kernel;
    
    const kernelSize = selectedKernel.length; // Kernel size (usually 3x3)
    const offset = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < channels; c++) {
          const pixelIndex = (y * width + x) * channels + c;
          let sum = 0;

          // Apply kernel convolution, ensuring boundary pixels are handled
          for (let ky = -offset; ky <= offset; ky++) {
            for (let kx = -offset; kx <= offset; kx++) {
              const px = Math.min(Math.max(x + kx, 0), width - 1);
              const py = Math.min(Math.max(y + ky, 0), height - 1);
              const kernelValue = selectedKernel[ky + offset][kx + offset];
              const sourceIndex = (py * width + px) * channels + c;
              sum += imageData[sourceIndex] * kernelValue;
            }
          }

          // Clamp the values to the range [0, 255]
          result[pixelIndex] = Math.min(Math.max(Math.round(sum), 0), 255);
        }
      }
    }

    return result;
  }

  // Enhanced color processing function
  private enhanceColors(imageData: Buffer, channels: number, saturation: number = 1.2): Buffer {
    const result = Buffer.alloc(imageData.length);
    
    // Process each pixel
    for (let i = 0; i < imageData.length; i += channels) {
      if (channels >= 3) { // Only process if we have RGB data
        // Get RGB components
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        
        // Calculate luminance (brightness)
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Apply saturation enhancement
        result[i] = Math.min(255, Math.max(0, luminance + saturation * (r - luminance)));
        result[i + 1] = Math.min(255, Math.max(0, luminance + saturation * (g - luminance)));
        result[i + 2] = Math.min(255, Math.max(0, luminance + saturation * (b - luminance)));
        
        // Copy alpha channel if present
        if (channels === 4 && i + 3 < imageData.length) {
          result[i + 3] = imageData[i + 3];
        }
      } else {
        // For grayscale, just copy the data
        result[i] = imageData[i];
      }
    }
    
    return result;
  }

  // Sharpen image function triggered by the microservice
  @MessagePattern({ cmd: 'sharpen_image' })
  async sharpenImage(imagePath: string) {
    try {
      // Check if the image exists
      if (!fs.existsSync(imagePath)) {
        throw new Error('File does not exist');
      }

      // Set up the output path
      const outputDir = path.join(process.cwd(), 'apps/basic-processing/output_images');
      const outputFileName = 'sharpened_image.png';
      const outputFilePath = path.join(outputDir, outputFileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Read image metadata
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const { width, height } = metadata;
      const channels = metadata.channels || 3; // Default to RGB if not specified

      // Process the image in stages for better quality
      
      // 1. Resize if necessary for better processing (maintain aspect ratio)
      const resizedImage = await image
        .resize({
          width: Math.min(width!, 1200), // Limit width for processing efficiency
          height: Math.min(height!, 1200),
          fit: 'inside',
          withoutEnlargement: true
        })
        .raw()
        .toBuffer();
      
      // Get new dimensions after resize
      const resizedMetadata = await sharp(resizedImage, {
        raw: {
          width: Math.min(width!, 1200),
          height: Math.min(height!, 1200),
          channels: channels
        }
      }).metadata();
      
      // 2. Apply color enhancement
      const colorEnhanced = this.enhanceColors(resizedImage, channels);
      
      // 3. Apply sharpening
      const sharpenedBuffer = this.applyConvolution(
        colorEnhanced, 
        resizedMetadata.width!, 
        resizedMetadata.height!, 
        channels,
        'strong' // Use stronger sharpening kernel
      );

      // 4. Save the sharpened image with optimization
      await sharp(sharpenedBuffer, {
        raw: {
          width: resizedMetadata.width!,
          height: resizedMetadata.height!,
          channels: channels,
        }
      })
      .png({ compressionLevel: 6, adaptiveFiltering: true })
      .toFile(outputFilePath);

      return {
        success: true,
        message: 'Enhanced image created with improved color and clarity',
        savedImagePath: outputFilePath,
      };
    } catch (error) {
      console.error('Sharpen image creation error:', error);
      return {
        success: false,
        message: 'Failed to process image',
        error: error.message,
      };
    }
  }
}