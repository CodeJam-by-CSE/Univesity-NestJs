import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { 
  ResizeImageDto, 
  GreyscaleDto,
  ContrastDto,
  ImagePathDto,
  RotateImageDto,
  SharpenImageDto,
  FloodFillDto
} from './app.dto';

/**
 * Controller for basic image processing operations.
 *
 * Handles fundamental image transformations such as:
 * - Resizing images
 * - Converting to greyscale
 * - Creating negative images
 * - Adjusting contrast
 * - Rotating images
 * - Sharpening images
 * - Applying emboss effects
 */
@ApiTags('basic-processing')
@Controller('basic-processing')
export class BasicProcessingController {
  constructor(private readonly mainService: AppService) {}

  @Post('resize')
  @ApiOperation({ summary: 'Resize an image to specific dimensions' })
  @ApiResponse({ status: 200, description: 'Image successfully resized' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters' })
  async resizeImage(@Body() body: ResizeImageDto) {
    return this.mainService.sendToBasicProcessingResize(body.imagePath, body.width, body.height);
  }

  @Post('greyscale')
  @ApiOperation({ summary: 'Convert an image to greyscale' })
  @ApiResponse({ status: 200, description: 'Image successfully converted to greyscale' })
  async convertGreyscale(@Body() body: GreyscaleDto) {
    return this.mainService.sendToBasicProcessingGreyscale(body.imagePath);
  }

  @Post('negative')
  @ApiOperation({ summary: 'Create negative version of an image' })
  @ApiResponse({ status: 200, description: 'Negative image successfully created' })
  async createNegative(@Body() body: ImagePathDto) {
    return this.mainService.sendToBasicProcessingNegative(body.imagePath);
  }

  @Post('contrast')
  @ApiOperation({ summary: 'Adjust image contrast' })
  @ApiResponse({ status: 200, description: 'Image contrast successfully adjusted' })
  async adjustContrast(@Body() body: ContrastDto) {
    return this.mainService.sendToBasicProcessingContrast(body.imagePath, body.factor);
  }

  @Post('rotate')
  @ApiOperation({ summary: 'Rotate an image by specified angle' })
  @ApiResponse({ status: 200, description: 'Image successfully rotated' })
  async rotateImage(@Body() body: RotateImageDto) {
    return this.mainService.sendToBasicProcessingRotate(body.imagePath, body.angle);
  }

  @Post('sharpen')
  @ApiOperation({ summary: 'Sharpen an image' })
  @ApiResponse({ status: 200, description: 'Image successfully sharpened' })
  async sharpenImage(@Body() body: ImagePathDto) {
    return this.mainService.sendToBasicProcessingSharpen(body.imagePath);
  }

  @Post('emboss')
  @ApiOperation({ summary: 'Apply emboss effect to an image' })
  @ApiResponse({ status: 200, description: 'Emboss effect successfully applied' })
  async embossImage(@Body() body: ImagePathDto) {
    return this.mainService.sendToBasicProcessingEmboss(body.imagePath);
  }
}

/**
 * Controller for image enhancement operations.
 * 
 * Handles more advanced image enhancement techniques such as:
 * - Histogram equalization for improved contrast
 */
@ApiTags('enhancement')
@Controller('enhancement')
export class EnhancementController {
  constructor(private readonly mainService: AppService) {}

  @Post('histogram-equalization')
  @ApiOperation({ summary: 'Enhance image using histogram equalization' })
  @ApiResponse({ status: 200, description: 'Image successfully enhanced' })
  async histogramImageEnhancement(@Body() body: ImagePathDto) {
    return this.mainService.sendToEnhancementHistogram(body.imagePath);
  }

  @Post('flood_fill_image')
  async floodFillImage(@Body() body: FloodFillDto) {
    return this.mainService.sendToEnhancementFloodFill(body.imagePath, body.sr, body.sc, body.newColor);
  } 
}

/**
 * Controller for feature detection operations in images.
 * 
 * Handles algorithms for detecting features such as:
 * - Edge detection using Canny algorithm
 * - Corner detection using Harris algorithm
 */
@ApiTags('feature-detection')
@Controller('feature-detection')
export class FeatureDetectionController {
  constructor(private readonly mainService: AppService) {}

  @Post('canny-edge-detection')
  @ApiOperation({ summary: 'Detect edges of a given image using Canny algorithm' })
  @ApiResponse({ status: 200, description: 'Edges successfully detected' })
  async cannyEdgeDetection(@Body() body: ImagePathDto) {
    return this.mainService.sendToFeatureDetectionCannyEdgeDetection(body.imagePath);
  }

  @Post('harris-corner-detection')
  @ApiOperation({ summary: 'Detect corners in an image using Harris algorithm' })
  @ApiResponse({ status: 200, description: 'Corners successfully detected' })
  async harrisSharp(@Body() body: SharpenImageDto) {
    return this.mainService.sendToFeatureDetectionHarrisSharp(body.imagePath, body.k, body.windowSize, body.thresh);
  }
}