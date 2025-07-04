import { Injectable } from '@nestjs/common';
import { CreateHomeScreenDto } from './dto/create-home-screen.dto';
import { UpdateHomeScreenDto } from './dto/update-home-screen.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeScreenService {
  constructor(
    private readonly prisma:PrismaService
  ) {}
  async findAll(userId:string) {
    const userJobs = await this.prisma.jobs.findMany({
      where:{
        inspector_id:userId
      },
      orderBy:[
        {
          working_status: 'asc'
        },
        {
          created_at: 'desc'
        }
      ]
    })
    return userJobs
  }

  async projectStatus(userId:string){
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
      success:true,
      data:{
        totaljobs,
        totalPendingJobs,
        totalCompletedJobs
      }
    }
  }

  async findOne(id: string, userId:string) {
    return await this.prisma.jobs.findUnique({
      where:{
        id:id,
        inspector_id:userId
      }
    })
  }


}
