/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CannyEdgeDetectionService } from './services/cannyEdgeDetection.service';


@Injectable()
export class FeatureDetectionService {
  constructor(
    private readonly cannyEdgeService: CannyEdgeDetectionService
  ) {}


  async cannyEdgeDetection( imagePath: string ) {
    return await this.cannyEdgeService.detectEdges(imagePath)
  }
  
}