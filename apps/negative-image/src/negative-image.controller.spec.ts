/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { NegativeImageController } from './negative-image.controller';
import { NegativeImageService } from './negative-image.service';

describe('NegativeImageController', () => {
  let negativeImageController: NegativeImageController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NegativeImageController],
      providers: [NegativeImageService],
    }).compile();

    negativeImageController = app.get<NegativeImageController>(NegativeImageController);
  });
});
