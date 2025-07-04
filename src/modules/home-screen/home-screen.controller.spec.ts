import { Test, TestingModule } from '@nestjs/testing';
import { HomeScreenController } from './home-screen.controller';
import { HomeScreenService } from './home-screen.service';

describe('HomeScreenController', () => {
  let controller: HomeScreenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeScreenController],
      providers: [HomeScreenService],
    }).compile();

    controller = module.get<HomeScreenController>(HomeScreenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
