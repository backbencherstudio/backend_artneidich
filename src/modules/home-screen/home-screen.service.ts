import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHomeScreenDto } from './dto/create-home-screen.dto';
import { UpdateHomeScreenDto } from './dto/update-home-screen.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/common/repository/user/user.repository';

@Injectable()
export class HomeScreenService {
  constructor(
    private readonly prisma:PrismaService
  ) {}
  async findAll(userId:string, address:string) {
    try {
      const userExist = await UserRepository.exist({
        field: 'id',
        value: userId
      })

      if(!userExist){
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
      }

      // get all jobs where working_status is pending and draft
      const whereConditions:any = {
        inspector_id:userId,
        working_status:{
          in:['pending', 'draft']
        }
      }
      // If an address is provided, add the filter to the query
      if (address) {
        whereConditions.address = {
          contains: address, // Performs a "like" search on the address field
          mode: 'insensitive', // M ake the search case-insensitive
        };
      }

      const userJobs = await this.prisma.jobs.findMany({
        where:whereConditions,
        orderBy:[
          {
            working_status: 'asc'
          },
          {
            created_at: 'desc'
          }
        ]
      })
      if(!userJobs){
        throw new HttpException('Job Not Added To This User', HttpStatus.NOT_FOUND)
      }
      return {
        status: 200,
        success: true,
        message: 'Fetch All Job List',
        data: userJobs
      }
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async projectStatus(userId:string){
    try {
      const totaljobs = await this.prisma.jobs.count({
        where:{
          inspector_id:userId
        }
      })
      
      const totalPendingJobs = await this.prisma.jobs.count({
        where:{
          inspector_id:userId,
          working_status:'pending'
        }
      })
  
      const totalCompletedJobs = await this.prisma.jobs.count({
        where:{
          inspector_id:userId,
          working_status:'completed'
        }
      })
      
      return {
        status:200,
        success:true,
        message: 'status fetch successfully',
        data:{
          totaljobs,
          totalPendingJobs,
          totalCompletedJobs
        }
      }
      
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: string, userId:string) {
    try {
      const response = await this.prisma.jobs.findUnique({
        where:{
          id:id,
          inspector_id:userId
        }
      })
      if(!response){
        throw new HttpException('Job not found or job id not correct', HttpStatus.NOT_FOUND)
      }
      return {
        status: 200,
        success: true,
        message:'Job Fetch Successfully',
        data: response
      }
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


}
