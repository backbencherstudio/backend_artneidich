  import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Role } from 'src/common/guard/role/role.enum';
import { Roles } from 'src/common/guard/role/roles.decorator';

@Controller('label')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin-labels')
  async getAdminAreas(@Req() req: Request) {
    return this.labelService.postAdminLabels(req.body);
  }

  // get all areas
  @UseGuards(JwtAuthGuard)
  @Get('user-labels')
  async getUserAreas(@Req() req: Request) {
    const userId = req.user.userId;
    return this.labelService.getUserAreas(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id')
  async deleteArea(@Param('id') id: string, @Req() req: Request) {
    return this.labelService.deleteArea(id);
  }

}
