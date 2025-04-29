/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmbossService {
  private readonly embossKernels = {
    standard: [
      [-2, -1, 0],
      [-1, 1, 1],
      [0, 1, 2],
    ],
    topLeft: [
      [2, 1, 0],
      [1, 1, -1],
      [0, -1, -2],
    ],
    leftRight: [
      [0, 0, 0],
      [1, 2, -1],
      [0, 0, 0],
    ],
    topBottom: [
      [0, 1, 0],
      [0, 1, 0],
      [0, -2, 0],
    ],
    highRelief: [
      [-3, -2, -1],
      [-2, 0, 2],
      [-1, 2, 3],
    ],
  };

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
    const offset = 1; // 3x3 kernel => offset is 1

    const kernelMultiplier = intensity * 0.7;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let embossEffect = 0;

        for (let ky = -offset; ky <= offset; ky++) {
          for (let kx = -offset; kx <= offset; kx++) {
            const px = x + kx;
            const py = y + ky;

            if (px >= 0 && px < width && py >= 0 && py < height) {
              const pixelPos = (py * width + px) * channels;
              const kernelVal = kernel[ky + offset][kx + offset] * kernelMultiplier;
              
              let pixelValue = 0;
              if (channels >= 3) {
                pixelValue = (imageData[pixelPos] + imageData[pixelPos + 1] + imageData[pixelPos + 2]) / 3; // average RGB
              } else {
                pixelValue = imageData[pixelPos];
              }
              
              embossEffect += pixelValue * kernelVal;
            }
          }
        }

        embossEffect += 128; // base gray to center emboss effect
        embossEffect = Math.min(Math.max(Math.round(embossEffect), 0), 255);

        const pixelIndex = (y * width + x) * channels;

        if (!grayScale) {
          for (let c = 0; c < Math.min(3, channels); c++) {
            result[pixelIndex + c] = embossEffect;
          }
        } else {
          for (let c = 0; c < channels; c++) {
            result[pixelIndex + c] = embossEffect;
          }
        }

        if (channels === 4) {
          result[pixelIndex + 3] = 255; // full opacity
        }
      }
    }

    return result;
  }

  @MessagePattern({ cmd: 'emboss_image' })
  async embossImage(data: {
    imagePath: string,
    direction?: keyof typeof this.embossKernels,
    intensity?: number,
    colored?: boolean
  } | string) {
    try {
      const imagePath = typeof data === 'string' ? data : (data as any).path || (data as any).imagePath;
      const direction = typeof data === 'string' ? 'standard' : (data as any).direction ?? 'standard';
      const intensity = typeof data === 'string' ? 1.0 : (data as any).intensity ?? 1.0;
      const colored = typeof data === 'string' ? false : (data as any).colored ?? false;

      if (!fs.existsSync(imagePath)) {
        throw new Error('Input image missing');
      }

      const outputDir = path.join(process.cwd(), 'apps/basic-processing/output_images');
      const outputFileName = `embossed_${String(direction)}_${intensity.toFixed(1)}.png`;
      const outputFilePath = path.join(outputDir, outputFileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const image = sharp(imagePath);
      const metadata = await image.metadata();

      const maxDimension = 600;
      let resizeWidth = metadata.width || 256;
      let resizeHeight = metadata.height || 256;

      if (resizeWidth > maxDimension) {
        resizeHeight = Math.round(resizeHeight * (maxDimension / resizeWidth));
        resizeWidth = maxDimension;
      } else if (resizeHeight > maxDimension) {
        resizeWidth = Math.round(resizeWidth * (maxDimension / resizeHeight));
        resizeHeight = maxDimension;
      }

      const preprocessed = await image
        .resize({
          width: resizeWidth,
          height: resizeHeight,
          fit: 'cover',
          withoutEnlargement: false,
        })
        .ensureAlpha() // keep RGBA
        .raw()
        .toBuffer();

      const channels = metadata.channels ?? 4;

      const embossedBuffer = this.applyConvolution(
        preprocessed,
        resizeWidth,
        resizeHeight,
        channels,
        direction as keyof typeof this.embossKernels,
        intensity,
        !colored // colored = false means grayscale
      );

      await sharp(embossedBuffer, {
        raw: {
          width: resizeWidth,
          height: resizeHeight,
          channels: channels,
        }
      })
        .png({ compressionLevel: 0 })
        .toFile(outputFilePath);

      return {
        success: true,
        message: `Embossed with '${String(direction)}' at intensity ${intensity}`,
        savedImagePath: outputFilePath,
      };
    } catch (error) {
      console.error('Embossing failed:', error);
      return {
        success: false,
        message: 'Embossing operation unsuccessful',
        error: error.message,
      };
    }
  }
}
