/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HistogramEqualizationService } from './services/histrogramEqualization.service';


@Injectable()
export class EnhancementService {
  constructor(
    private readonly histogramService: HistogramEqualizationService,
    
  ) {}

 

  async histogramEqualization( imagePath: string ) {
    return await this.histogramService.equalizeHistogram(imagePath)
  }

  
}