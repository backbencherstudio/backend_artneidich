import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobAreaDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Job ID that the area belongs to' })
  jobId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Area name, e.g. Kitchen, Hallway' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Optional note for the area' })
  note?: string;
}
