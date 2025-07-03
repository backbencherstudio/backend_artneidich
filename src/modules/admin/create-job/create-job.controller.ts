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
    try {
      return await this.createJobService.findAll();
    } catch (error) {
      return {
        message: 'Error fetching jobs',
        error: error.message,
      };
    }
  }

  @Post()
  async create(@Body() createCreateJobDto: CreateCreateJobDto) {
    try{
      return this.createJobService.create(createCreateJobDto);
    } catch (error) {
      return {
        message: 'Error creating job',
        error: error.message,
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCreateJobDto: UpdateCreateJobDto
  ) {
    try {
      return await this.createJobService.update(id, updateCreateJobDto);
    } catch (error) {
      return {
        message: 'Error updating job',
        error: error.message,
      };
    }
  }
 
  @Patch('add-note/:id')
  async updatenotes(
    @Param('id') id: string,
    @Body() updateJobNoteDto: UpdateJobNoteDto
  ) {
    try {
      return await this.createJobService.updatenote(id, updateJobNoteDto.notes);
    } catch (error) {
      return {
        message: 'Error updating job',
        error: error.message,
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.createJobService.delete(id);
    } catch (error) {   
      return {
        message: 'Error deleting job',
        error: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.createJobService.findOne(id);
    } catch (error) {
      return {
        message: 'Error fetching job',
        error: error.message,
      };
    }
  }

}
