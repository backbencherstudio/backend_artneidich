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
  HttpStatus,
  Query
} from '@nestjs/common';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { JobListService } from './job-list.service';
import { CreateJobListDto } from './dto/create-job-list.dto';
import { UpdateJobListDto } from './dto/update-job-list.dto';
import { UploadJobImageDto } from './dto/upload-job-image.dto';
import { CreateJobAreaDto } from './dto/create-job-area.dto';
import { UploadAreaImagesDto } from './dto/upload-area-images.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('Job List')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('job-list')
export class JobListController {
  constructor(private readonly jobListService: JobListService) {}

  

  @Patch('upload-multiple-images')
  @ApiOperation({ summary: 'Upload multiple images for a job with their titles and descriptions' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './public/storage/inspection-images',
        filename: (_, file, cb) =>
          cb(null, Array(32).fill(null)
            .map(() => Math.random().toString(16).slice(2,3)).join('') + file.originalname),
      }),
    }),
  )
  
  async uploadMultipleJobImages(
    @Body('payload') payloadString: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const payload = JSON.parse(payloadString);  
    const response = await this.jobListService.bulkUploadJobImages(
      payload, files, req.user.userId,
    );
    return response;
  }

  @Post('submit-report/:jobId')
  @ApiOperation({ summary: 'Generate inspection PDF from saved images' })
  async generateInspectionPDF(
    @Param('jobId') jobId: string,
    @Req() req: Request,
  ) {
    const userId = req.user.userId;              // get inspector ID from auth
    const response = await this.jobListService.sendInspectionPDF(jobId, userId);
    return response;
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

  // ------- Area APIs -------
  @Post('job-areas')
  async createArea(@Body() body: CreateJobAreaDto) {
    const response = await this.jobListService.createJobArea(body.jobId, body.name, body.note);
    return response
  }

  

  // @Post('areas/upload-images')
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FilesInterceptor('images', 20, {
  //     storage: diskStorage({
  //       destination: './public/storage/inspection-images',
  //       filename: (req, file, cb) => {
  //         const randomName = Array(32)
  //           .fill(null)
  //           .map(() => Math.round(Math.random() * 16).toString(16))
  //           .join('');
  //         cb(null, `${randomName}${file.originalname}`);
  //       },
  //     }),
  //   }),
  // )
  // async uploadAreaImages(
  //   @Body() dto: UploadAreaImagesDto,
  //   @UploadedFiles() images: Express.Multer.File[],
  // ) {
  //   return this.jobListService.uploadAreaImages(dto.areaId, dto.imageData, images, dto.statusType);
  // }

  // @Get(':jobId/areas')
  // async listAreas(@Param('jobId') jobId: string) {
  //   return this.jobListService.listJobAreas(jobId);
  // }

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
