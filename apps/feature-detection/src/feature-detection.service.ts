/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CannyEdgeDetectionService } from './services/cannyEdgeDetection.service';
import { HoughTransformService } from './services/houghTransform.service';


@Injectable()
export class FeatureDetectionService {
  constructor(
    private readonly cannyEdgeService: CannyEdgeDetectionService,
    private readonly houghTransformService: HoughTransformService,
  ) {}


  async cannyEdgeDetection( imagePath: string ) {
    return await this.cannyEdgeService.detectEdges(imagePath)
  }
  async houghTransform( imagePath: string ) {
    return await this.houghTransformService.detectLines(imagePath)
  }


  
}