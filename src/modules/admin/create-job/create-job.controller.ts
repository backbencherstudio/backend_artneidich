import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateJobService } from './create-job.service';
import { CreateCreateJobDto } from './dto/create-create-job.dto';
import { UpdateCreateJobDto, UpdateJobNoteDto } from './dto/update-create-job.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { Role } from 'src/common/guard/role/role.enum';
import { RolesGuard } from 'src/common/guard/role/roles.guard';


@Controller('admin/create-job')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class CreateJobController {
  constructor(private readonly createJobService: CreateJobService) {}

  @Get()
  async findall() {
    const allJobs = await this.createJobService.findAll();
    return allJobs;
  }

  @Post()
  async create(@Body() createCreateJobDto: CreateCreateJobDto) {
      // console.log(createCreateJobDto)
      if (typeof createCreateJobDto.due_date === 'string') {
        createCreateJobDto.due_date = new Date(createCreateJobDto.due_date);
      }
      const job = await this.createJobService.create(createCreateJobDto);
      return {
        status: 201,
        success: true,
        message: 'Job created successfully',
        data: job,
      };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCreateJobDto: UpdateCreateJobDto
  ) {
      const job = await this.createJobService.update(id, updateCreateJobDto);
      return job
  }
 
  @Patch('add-note/:id')
  async updatenotes(
    @Param('id') id: string,
    @Body() updateJobNoteDto: UpdateJobNoteDto
  ) {
    
    const updateNotes= await this.createJobService.updatenote(id, updateJobNoteDto.notes);
    return updateNotes
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const job = await this.createJobService.delete(id);
    return job
    
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    
    const getJob = await this.createJobService.findOne(id);
    return getJob
  }

}
