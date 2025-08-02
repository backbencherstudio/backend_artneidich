import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AreaImageData {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Title of the image' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;
}

export class UploadAreaImagesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Area ID to attach the images to' })
  areaId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AreaImageData)
  @ApiProperty({ type: [AreaImageData] })
  imageData: AreaImageData[];

  @IsOptional()
  @IsString()
  @ApiProperty({ enum: ['draft', 'completed'], required: false })
  statusType?: 'draft' | 'completed';
}
