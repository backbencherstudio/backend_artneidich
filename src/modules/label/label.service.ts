import { Injectable } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LabelService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserAreas(userId: string) {
    try {
      const labels = await this.prisma.label.findMany();

      return {
        success: true,
        data: labels,
        message: 'User labels retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async postAdminLabels(body: any) {
    try {
      const label = await this.prisma.label.create({
        data: body
      });
      return {
        success: true,
        message: 'Label created successfully',
        data: label
      };
    }
    catch (error) {
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

  async deleteArea(labelId: string) {
    try {
      // First, verify that the area belongs to a job created by this user
      const area = await this.prisma.label.findFirst({
        where: {
          id: labelId,
        }
      });

      if (!area) {
        return {
          success: false,
          message: 'Area not found or you do not have permission to delete this area'
        };
      }

      // Delete the area
      await this.prisma.label.delete({
        where: {
          id: labelId
        }
      });

      return {
        success: true,
        message: 'label deleted successfully'
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
