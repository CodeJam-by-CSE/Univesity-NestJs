/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmbossService {
  // Enhanced emboss kernels for different directional effects
  private readonly embossKernels = {
    // Standard emboss (enhanced for better definition)
    standard: [
      [-2, -1, 0],
      [-1, 1, 1],
      [0, 1, 2],
    ],
    // Top-left to bottom-right lighting
    topLeft: [
      [2, 1, 0],
      [1, 1, -1],
      [0, -1, -2],
    ],
    // Left to right lighting
    leftRight: [
      [0, 0, 0],
      [1, 1, -1],
      [0, 0, 0],
    ],
    // Top to bottom lighting
    topBottom: [
      [0, 1, 0],
      [0, 1, 0],
      [0, -1, 0],
    ],
    // High relief effect
    highRelief: [
      [-3, -2, -1],
      [-2, 1, 2],
      [-1, 2, 3],
    ],
  };

  // Apply convolution with adjustable intensity and direction
  private applyConvolution(
    imageData: Buffer, 
    width: number, 
    height: number, 
    channels: number, 
    kernelType: keyof typeof this.embossKernels = 'standard',
    intensity: number = 1.0,
    grayScale: boolean = true
  ): Buffer {
    const result = Buffer.alloc(imageData.length);
    const kernel = this.embossKernels[kernelType];
    const offset = 1;

    // Calculate kernel multiplier based on intensity
    const kernelMultiplier = intensity;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // First calculate emboss effect
        let embossEffect = 128; // Start at 128 to create emboss effect (centered gray)
        
        for (let ky = -offset; ky <= offset; ky++) {
          for (let kx = -offset; kx <= offset; kx++) {
            const px = Math.min(Math.max(x + kx, 0), width - 1);
            const py = Math.min(Math.max(y + ky, 0), height - 1);
            const kernelVal = kernel[ky + offset][kx + offset] * kernelMultiplier;
            
            // For embossing, we commonly use just one channel (e.g., brightness)
            // or average of RGB for calculation
            let pixelValue = 0;
            const pixelPos = (py * width + px) * channels;
            
            // Get average of RGB or just use first channel
            if (channels >= 3) {
              pixelValue = (imageData[pixelPos] + imageData[pixelPos + 1] + imageData[pixelPos + 2]) / 3;
            } else {
              pixelValue = imageData[pixelPos];
            }
            
            embossEffect += pixelValue * kernelVal;
          }
        }
        
        // Clamp to valid range
        embossEffect = Math.max(0, Math.min(255, embossEffect));
        
        // Apply emboss to each channel
        const pixelIndex = (y * width + x) * channels;
        
        if (grayScale) {
          // Grayscale emboss - traditional style
          for (let c = 0; c < Math.min(channels, 3); c++) {
            result[pixelIndex + c] = embossEffect;
          }
        } else {
          // Colored emboss - preserves some color information
          for (let c = 0; c < Math.min(channels, 3); c++) {
            // Mix original colors with emboss effect for a colored emboss
            const originalValue = imageData[pixelIndex + c];
            // Adjust this mixing ratio for different effects
            const colorMix = 0.3; 
            result[pixelIndex + c] = Math.max(0, Math.min(255, 
              embossEffect * (1 - colorMix) + originalValue * colorMix
            ));
          }
        }
        
        // Preserve alpha channel if it exists
        if (channels === 4) {
          result[pixelIndex + 3] = imageData[pixelIndex + 3];
        }
      }
    }

    return result;
  }

  // Enhanced emboss method with more options
  @MessagePattern({ cmd: 'emboss_image' })
  async embossImage(data: { 
    imagePath: string,
    direction?: keyof typeof this.embossKernels,
    intensity?: number,
    colored?: boolean
  } | string) {
    try {
      // Support both string and object parameters for backward compatibility
      const imagePath = typeof data === 'string' ? data : data.imagePath;
      const direction = typeof data === 'string' ? 'standard' : (data.direction || 'standard');
      const intensity = typeof data === 'string' ? 1.0 : (data.intensity || 1.0);
      const colored = typeof data === 'string' ? false : (data.colored || false);

      if (!fs.existsSync(imagePath)) {
        throw new Error('File does not exist');
      }

      const outputDir = path.join(process.cwd(), 'apps/basic-processing/output_images');
      const outputFileName = `embossed_${String(direction)}_${intensity.toFixed(1)}.png`;
      const outputFilePath = path.join(outputDir, outputFileName);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Get image information
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      
      // Calculate appropriate resize dimensions while maintaining aspect ratio
      const maxDimension = 1200; // Set maximum dimension for processing
      let resizeWidth = metadata.width!;
      let resizeHeight = metadata.height!;

      if (resizeWidth > maxDimension || resizeHeight > maxDimension) {
        const aspectRatio = resizeWidth / resizeHeight;
        if (resizeWidth > resizeHeight) {
          resizeWidth = maxDimension;
          resizeHeight = Math.round(maxDimension / aspectRatio);
        } else {
          resizeHeight = maxDimension;
          resizeWidth = Math.round(maxDimension * aspectRatio);
        }
      }
      
      // Preprocess image - resize for better performance
      // FIX: Remove the conditional median that can result in 0 value
      const preprocessed = await image
        .resize({
          width: resizeWidth,
          height: resizeHeight,
          fit: 'inside',
          withoutEnlargement: true
        })
        // Convert to sRGB colorspace for consistent results
        .toColorspace('srgb')
        // Fix: Only apply median if intensity is high enough, otherwise skip it
        .raw()
        .toBuffer();
      
      // Get channels info for processing
      const channels = metadata.channels || 3;
      
      // Apply the emboss effect
      const embossedBuffer = this.applyConvolution(
        preprocessed, 
        resizeWidth, 
        resizeHeight, 
        channels,
        direction as keyof typeof this.embossKernels,
        intensity,
        !colored
      );
      
      // Additional post-processing for enhanced results
      await sharp(embossedBuffer, {
        raw: {
          width: resizeWidth,
          height: resizeHeight,
          channels: channels,
        }
      })
      // Adjust contrast for more defined emboss effect
      .linear(1.1, -5)
      // Output with appropriate compression
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outputFilePath);

      return {
        success: true,
        message: `Enhanced emboss effect created with '${String(direction)}' direction at ${intensity}x intensity`,
        savedImagePath: outputFilePath,
        details: {
          effect: colored ? 'Colored emboss' : 'Traditional emboss',
          direction: direction,
          intensity: intensity,
          dimensions: `${resizeWidth}x${resizeHeight}`,
        }
      };
    } catch (error) {
      console.error('Emboss error:', error);
      return {
        success: false,
        message: 'Failed to apply emboss filter',
        error: error.message,
      };
    }
  }
}