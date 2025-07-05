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
  FileTypeValidator
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

  // @Post()
  // @ApiOperation({ summary: 'Create a new job list entry' })
  // async create(@Body() createJobListDto: CreateJobListDto) {
  //   try {
  //     console.log(createJobListDto);
  //     return await this.jobListService.create(createJobListDto);
  //   } catch (error) {
  //     return {
  //       statusCode: 500,
  //       message: error.message,
  //     };
  //   }
  // }

  // @Get()
  // @ApiOperation({ summary: 'Get all jobs for the authenticated inspector' })
  // async findAll(@Req() req: Request) {
  //   try {
  //     const userId = req.user.userId;
  //     return await this.jobListService.findAll(userId);
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: 'Error retrieving jobs',
  //       error: error.message,
  //     };
  //   }
  // }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get a specific job by ID' })
  // async findOne(@Param('id') id: string, @Req() req: Request) {
  //   try {
  //     const userId = req.user.userId;
  //     return await this.jobListService.findOne(id, userId);
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: 'Error retrieving job',
  //       error: error.message,
  //     };
  //   }
  // }




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
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: Request,
  ) {
    try {
      const userId = req.user.userId;
  
      // Parse the JSON string from form-data
      let imageData: Array<{ title: string; description?: string }>;
      try {
        imageData = JSON.parse(imageDataString);
      } catch (parseError) {
        return {
          success: false,
          message: 'Invalid imageData format. Must be a valid JSON string.',
          error: parseError.message,
        };
      }
      // console.log(jobId, userId, imageData, images);
      return await this.jobListService.uploadMultipleJobImages(
        jobId,
        userId,
        imageData,
        images,
      );
    } catch (error) {
      return {
        success: false,
        message: 'Error uploading images',
        error: error.message,
      };
    }
  }

  // @Get(':id/images')
  // @ApiOperation({ summary: 'Get all images for a specific job' })
  // async getJobImages(@Param('id') jobId: string, @Req() req: Request) {
  //   try {
  //     const userId = req.user.userId;
  //     return await this.jobListService.getJobImages(jobId, userId);
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: 'Error retrieving job images',
  //       error: error.message,
  //     };
  //   }
  // }

  // @Patch(':id/status')
  // @ApiOperation({ summary: 'Update job status (pending, in-progress, completed)' })
  // async updateJobStatus(
  //   @Param('id') jobId: string,
  //   @Body() body: { status: string },
  //   @Req() req: Request,
  // ) {
  //   try {
  //     const userId = req.user.userId;
  //     return await this.jobListService.updateJobStatus(jobId, userId, body.status);
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: 'Error updating job status',
  //       error: error.message,
  //     };
  //   }
  // }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update job details' })
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateJobListDto: UpdateJobListDto,
  // ) {
  //   // Implementation for updating job details
  //   return {
  //     success: false,
  //     message: 'Update functionality not implemented yet',
  //   };
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a job' })
  // async remove(@Param('id') id: string) {
  //   // Implementation for deleting jobs
  //   return {
  //     success: false,
  //     message: 'Delete functionality not implemented yet',
  //   };
  // }
}
