import { Injectable } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LabelService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserAreas(userId: string) {
    try {
      const areas = await this.prisma.jobArea.findMany({
        where: {
          job: {
            inspector_id: userId
          }
        },
        select: {
          id: true,
          name: true,
          note: true,
          created_at: true,
          job: {
            select: {
              id: true,
              inspection_type: true,
              client_name: true,
              address: true,
              status: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return {
        success: true,
        data: areas,
        message: 'User areas retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  findAll() {
    return `This action returns all label`;
  }

  findOne(id: number) {
    return `This action returns a #${id} label`;
  }

  update(id: number, updateLabelDto: UpdateLabelDto) {
    return `This action updates a #${id} label`;
  }

  async deleteArea(areaId: string, userId: string) {
    try {
      // First, verify that the area belongs to a job created by this user
      const area = await this.prisma.jobArea.findFirst({
        where: {
          id: areaId,
          job: {
            inspector_id: userId
          }
        },
        include: {
          job: true
        }
      });

      if (!area) {
        return {
          success: false,
          message: 'Area not found or you do not have permission to delete this area'
        };
      }

      // Delete the area
      await this.prisma.jobArea.delete({
        where: {
          id: areaId
        }
      });

      return {
        success: true,
        message: 'Area deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} label`;
  }
}
