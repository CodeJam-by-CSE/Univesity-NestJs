/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('EDGE_SERVICE') private client: ClientProxy,
    @Inject('BASIC_PROCESSING_SERVICE') private basicProcessingClient: ClientProxy,
  ) { }

  sendToEdgeService(imageBase64: string) {
    return this.client.send({ cmd: 'detect_edge' }, imageBase64);
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
}