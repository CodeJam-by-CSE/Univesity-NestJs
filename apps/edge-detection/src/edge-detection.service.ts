import { Injectable } from '@nestjs/common';

@Injectable()
export class EdgeDetectionService {
  getHello(): string {
    return 'Hello World!';
  }
}
