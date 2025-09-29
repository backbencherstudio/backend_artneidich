import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { CreateCreateJobDto } from './dto/create-create-job.dto';
import { UpdateCreateJobDto } from './dto/update-create-job.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/common/repository/user/user.repository';

@Injectable()
export class CreateJobService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCreateJobDto: CreateCreateJobDto) {
    try {
      if(createCreateJobDto.userID){
        const user = await this.prisma.user.findUnique({
          where: {
            id: createCreateJobDto.userID,
          },
        });

        if(!user){
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      
      }
      return await this.prisma.jobs.create({
        data: {
          inspector_id: createCreateJobDto.userID,
          inspector_name: createCreateJobDto.inspector_name,
          inspection_type: createCreateJobDto.inspection_type,
          client_name: createCreateJobDto.client_name,
          client_email: createCreateJobDto.client_email,
          client_phone: createCreateJobDto.client_phone,
          address: createCreateJobDto.address,
          fha_number: createCreateJobDto.fha_number,
          status: createCreateJobDto.status,
          standard_fee: String(createCreateJobDto.fee_types.standard_fee),
          rush_fee: String(createCreateJobDto.fee_types.rush_fee),
          occupied_fee: String(createCreateJobDto.fee_types.occupied_fee),
          long_range_fee: String(createCreateJobDto.fee_types.long_range_fee),
          due_date: createCreateJobDto.due_date,
          // Add other fields as needed
        },
      });
      
    } catch (error) {
      if(error instanceof HttpException){
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateCreateJobDto: UpdateCreateJobDto) {
    try {
      if(updateCreateJobDto.userID){
        const user = await UserRepository.exist({
          field: 'id',
          value: updateCreateJobDto.userID,
        })
        if(!user){
          throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
        }
      }

      const job = await this.prisma.jobs.update({
        where: { id },
        data: {
          inspector_id: updateCreateJobDto.userID,
          inspector_name: updateCreateJobDto.inspector_name,
          inspection_type: updateCreateJobDto.inspection_type,
          client_name: updateCreateJobDto.client_name,
          client_email: updateCreateJobDto.client_email,
          client_phone: updateCreateJobDto.client_phone,
          address: updateCreateJobDto.address,
          fha_number: updateCreateJobDto.fha_number,
          status: updateCreateJobDto.status,
          standard_fee: updateCreateJobDto.fee_types ? String(updateCreateJobDto.fee_types.standard_fee) : undefined,
          rush_fee: updateCreateJobDto.fee_types ? String(updateCreateJobDto.fee_types.rush_fee) : undefined,
          occupied_fee: updateCreateJobDto.fee_types ? String(updateCreateJobDto.fee_types.occupied_fee) : undefined,
          long_range_fee: updateCreateJobDto.fee_types ? String(updateCreateJobDto.fee_types.long_range_fee) : undefined,
          // Add other fields as needed
        },
      });
      return {
        status: 200,
        success: true,
        message: 'Job updated successfully',
        data: job,
      };
    } catch (error) {
      if(error instanceof HttpException){
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  
  async updatenote(id: string, notes: string) {
    try {
      if(!notes){
        throw new HttpException('Please Provide the Notes', HttpStatus.BAD_REQUEST)
      }
      const isExist = await this.prisma.jobs.findFirst({
        where:{
          id:id
        }
      }) 
      
      if(!isExist){
        throw new HttpException('Job Not Found', HttpStatus.NOT_FOUND)
      }
      const job = await this.prisma.jobs.update({
        where: { id },
        data: { notes },
      });

      return{
        status: 200,
        success: true,
        message: 'Get Job Successfully',
        data: job
      }
      
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async delete(id: string) {
    try {
      if(id){
        const jobExist = await this.prisma.jobs.findFirst({
          where:{
            id: id
          }
        })
        if(!jobExist){
          throw new HttpException('Job not found', HttpStatus.NOT_FOUND)
        }
      }
      await this.prisma.jobs.delete({
        where: { id },
      });
      return {
        status: 200,
        success: true,
        message: 'Job deleted successfully',
      }
    } catch (error) {
      if(error instanceof HttpException){
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    try {
      const alljobs = await this.prisma.jobs.findMany();
      return {
        status: 200,
        success: true,
        message: 'AllJobs Fetch Successfully',
        data: alljobs
      }
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: string) {
    try {
      const getJobById = await this.prisma.jobs.findUnique({
        where: { id },
      });
      if(!getJobById){
        throw new HttpException('Job Not Found', HttpStatus.NOT_FOUND)
      }
      return {
        status: 200,
        success:true,
        message: "Get User Successfully",
        data: getJobById
      }
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
