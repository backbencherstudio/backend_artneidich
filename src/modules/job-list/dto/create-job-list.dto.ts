import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateJobListDto {
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Job ID to associate the image with',
        example: 'job_123',
    })
    jobId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Job ID to associate the image with',
        example: 'job_123',
    })
    imageTitle: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Job ID to associate the image with',
        example: 'job_123',
    })
    imageDescription?: string;
}
