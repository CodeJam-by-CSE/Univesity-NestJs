/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FeatureDetectionController } from './feature-detection.controller';
import { FeatureDetectionService } from './feature-detection.service';
import { CannyEdgeDetectionService } from './services/cannyEdgeDetection.service';
import { HoughTransformService } from './services/houghTransform.service';


@Module({
  imports: [],
  controllers: [FeatureDetectionController],
  providers: [
    FeatureDetectionService,
    CannyEdgeDetectionService,
    HoughTransformService  
  ],
})
export class FeatureDetectionModule {}
