import { Injectable } from '@nestjs/common';
import { CreateHomepageDto } from './dto/create-homepage.dto';
import { UpdateHomepageDto } from './dto/update-homepage.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const [totalUser, totalJob] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.jobs.count(),
      // this.prisma.label.count(),
    ]);
    return {
      totalUser,
      totalJob,
      // totalLabel,
    };
  }
}
