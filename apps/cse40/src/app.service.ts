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

  sendToBasicProcessingResize(imageBase64: string, width: number, height: number) {
    return this.basicProcessingClient.send(
      { cmd: 'resize_image' }, 
      { image: imageBase64, width, height }
    );
  }

  sendToBasicProcessingGreyscale(imageBase64: string) {
    return this.basicProcessingClient.send(
      { cmd: 'convert_greyscale' }, 
      imageBase64
    );
  }

  sendToBasicProcessingContrast(imageBase64: string, factor: number) {
    return this.basicProcessingClient.send(
      { cmd: 'adjust_contrast' }, 
      { image: imageBase64, factor }
    );
  }

  sendToBasicProcessingNegative(imageBase64: string) {
    return this.basicProcessingClient.send(
      { cmd: 'create_negative' }, 
      imageBase64
    );
  }
}