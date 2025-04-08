import * as fs from 'fs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('EDGE_SERVICE') private client: ClientProxy) { }

  sendToEdgeService(imageBase64: string) {
    return this.client.send('detect_edge', imageBase64);
  }
}

