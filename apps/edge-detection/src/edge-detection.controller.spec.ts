import { Test, TestingModule } from '@nestjs/testing';
import { EdgeDetectionController } from './edge-detection.controller';
import { EdgeDetectionService } from './edge-detection.service';

describe('EdgeDetectionController', () => {
  let edgeDetectionController: EdgeDetectionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EdgeDetectionController],
      providers: [EdgeDetectionService],
    }).compile();

    edgeDetectionController = app.get<EdgeDetectionController>(EdgeDetectionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(edgeDetectionController.getHello()).toBe('Hello World!');
    });
  });
});
