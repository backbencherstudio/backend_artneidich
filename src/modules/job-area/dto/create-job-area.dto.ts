import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobAreaDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Job id that this area belongs to' })
  jobId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Area name, e.g. Kitchen, Hallway' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Optional note that applies to the whole area' })
  note?: string;
}
