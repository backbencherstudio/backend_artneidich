import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class JobImageData {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Title for the uploaded image',
    example: 'Front View of Property',
  })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Description for the uploaded image',
    example: 'Front view showing the main entrance',
  })
  description?: string;
}

export class UploadJobImageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Job ID to associate the images with',
    example: 'job_123',
  })
  jobId: string;
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Job ID to associate the images with',
    example: 'job_123',
  })
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JobImageData)
  @ApiProperty({
    description: 'Array of image data with titles and descriptions',
    type: [JobImageData],
    example: [
      {
        title: 'Front View',
        description: 'Front view of the property'
      },
      {
        title: 'Back View',
        description: 'Back view of the property'
      }
    ]
  })
  imageData: JobImageData[];
} 