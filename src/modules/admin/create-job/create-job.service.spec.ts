import { Test, TestingModule } from '@nestjs/testing';
import { CreateJobService } from './create-job.service';

describe('CreateJobService', () => {
  let service: CreateJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateJobService],
    }).compile();

    service = module.get<CreateJobService>(CreateJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
