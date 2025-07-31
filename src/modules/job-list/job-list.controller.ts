import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Req, 
  UseInterceptors, 
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { JobListService } from './job-list.service';
import { CreateJobListDto } from './dto/create-job-list.dto';
import { UpdateJobListDto } from './dto/update-job-list.dto';
import { UploadJobImageDto } from './dto/upload-job-image.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('Job List')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('job-list')
export class JobListController {
  constructor(private readonly jobListService: JobListService) {}

  

  @Post('upload-multiple-images')
  @ApiOperation({ summary: 'Upload multiple images for a job with their titles and descriptions' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 20, { // Allow up to 20 images
      storage: diskStorage({
        destination: './public/storage/inspection-images',
        filename: (req, file, cb) =>{
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${file.originalname}`); 
        }
      })
    }),
  )
  async uploadMultipleJobImages(
    @Body('jobId') jobId: string,
    @Body('imageData') imageDataString: string,
    @Body('statusType') statusType: 'draft' | 'completed',
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: Request,
  ) {
      const userId = req.user.userId;
      // Parse the JSON string from form-data
      let imageData: Array<{ title: string; description?: string }>;
      try {
        imageData = JSON.parse(imageDataString);
      } catch (parseError) {
        // Throw an HttpException with the error message and a 400 status code
        throw new HttpException(
          {
            success: false,
            message: 'Invalid imageData format. Must be a valid JSON string.',
            error: parseError.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      // console.log(jobId, userId, imageData, images);
      const response = await this.jobListService.uploadMultipleJobImages(
        jobId,
        userId,
        imageData,
        images,
        statusType
      );
      return response
    
  }

  @Get('all-reports')
  async getDraftJobs(@Req() req:Request) {
    const userId = req.user.userId;
    const response = await this.jobListService.getDraftJobs(userId);
    return response
  }
  
  @Get('reports/:id')
  async getDraftJobsById(@Req() req:Request, @Param('id') id: string,) {
    const userId = req.user.userId;
    const response = await this.jobListService.getDraftJobsById(userId, id);
    return response
  }

  @Delete('image/:imageId')
  async deleteImage(@Param('imageId') imageId: string) {
    try {
      const response = await this.jobListService.deleteImage(imageId);
      return response;
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

}
