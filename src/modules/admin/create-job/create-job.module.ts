import { Module } from '@nestjs/common';
import { CreateJobService } from './create-job.service';
import { CreateJobController } from './create-job.controller';

@Module({
  controllers: [CreateJobController],
  providers: [CreateJobService],
})
export class CreateJobModule {}
