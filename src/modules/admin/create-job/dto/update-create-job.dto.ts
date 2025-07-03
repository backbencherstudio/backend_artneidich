import { PartialType } from '@nestjs/swagger';
import { CreateCreateJobDto } from './create-create-job.dto';

export class UpdateCreateJobDto extends PartialType(CreateCreateJobDto) {}

export class UpdateJobNoteDto {
  notes: string;
}
