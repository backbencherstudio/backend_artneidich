import { Injectable } from '@nestjs/common';
import { CreateCreateJobDto } from './dto/create-create-job.dto';
import { UpdateCreateJobDto } from './dto/update-create-job.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CreateJobService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCreateJobDto: CreateCreateJobDto) {
    return this.prisma.jobs.create({
      data: {
        inspector_id: createCreateJobDto.userID,
        inspector_name: createCreateJobDto.inspector_name,
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
  }

  async update(id: string, updateCreateJobDto: UpdateCreateJobDto) {
    return this.prisma.jobs.update({
      where: { id },
      data: {
        inspector_id: updateCreateJobDto.userID,
        inspector_name: updateCreateJobDto.inspector_name,
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
  }
  
  async updatenote(id: string, notes: string) {
    return this.prisma.jobs.update({
      where: { id },
      data: { notes },
    });
  }

  async delete(id: string) {
    return this.prisma.jobs.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.jobs.findMany();
  }

  async findOne(id: string) {
    return this.prisma.jobs.findUnique({
      where: { id },
    });
  }
}
