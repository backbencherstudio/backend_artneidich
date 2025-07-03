import { Test, TestingModule } from '@nestjs/testing';
import { CreateJobController } from './create-job.controller';
import { CreateJobService } from './create-job.service';

describe('CreateJobController', () => {
  let controller: CreateJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateJobController],
      providers: [CreateJobService],
    }).compile();

    controller = module.get<CreateJobController>(CreateJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
