import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHomepageDto } from './dto/create-homepage.dto';
import { UpdateHomepageDto } from './dto/update-homepage.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const [totalUser, totalJob] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.jobs.count(),
        // this.prisma.label.count(),
      ]);
      return {
        status:200,
        success:true,
        message: "Data fetch successfully",
        data:{
          totalUser,
          totalJob,
        }
      };
    } catch (error) {
      throw new HttpException('Internal server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
