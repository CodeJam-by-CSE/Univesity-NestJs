/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('BASIC_PROCESSING_SERVICE') private basicProcessingClient: ClientProxy,
    @Inject('ENHANCEMENT_SERVICE') private enhancementClient: ClientProxy,
  ) { }
    



  sendToEnhancementHistogram(imagePath: string) {
    return this.enhancementClient.send(
      { cmd: 'histogram_equalization_image' },
       imagePath
    );
  }

  sendToEnhancementFloodFill(
    imagePath: string,  
    sr: number,
    sc: number,
    newColor: number

  ) { 
    return this.enhancementClient.send(
      { cmd: 'flood_fill' },
      { imagePath, sr, sc, newColor }
    );
  }

  

  sendToBasicProcessingResize(imagePath: string, width: number, height: number) {
    return this.basicProcessingClient.send(
      { cmd: 'resize_image' },
      { imagePath, width, height }
    );
  }

  sendToBasicProcessingGreyscale(imagePath: string) {
    return this.basicProcessingClient.send(
      { cmd: 'convert_greyscale' },
      imagePath
    );
  }

  sendToBasicProcessingContrast(imagePath: string, factor: number) {
    return this.basicProcessingClient.send(
      { cmd: 'adjust_contrast' },
      { imagePath, factor }
    );
  }

  sendToBasicProcessingNegative(imagePath: string) {
    return this.basicProcessingClient.send(
      { cmd: 'create_negative' },
      imagePath
    );
  }
  sendToBasicProcessingSharpen(imagePath: string) {
    return this.basicProcessingClient.send(
      { cmd: 'sharpen_image' },
      imagePath
    );
  }
  sendToBasicProcessingEmboss(imagePath: string) {
    return this.basicProcessingClient.send(
      { cmd: 'emboss_image' },
      imagePath
    );
  }

  sendToBasicProcessingRotate(imagePath: string, angle: number) {
    return this.basicProcessingClient.send(
      { cmd: 'rotate_image' },
      { imagePath, angle }
    );
  }
}


