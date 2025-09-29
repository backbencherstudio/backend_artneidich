import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('label')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}
  // get all areas
  @UseGuards(JwtAuthGuard)
  @Get('user-areas')
  async getUserAreas(@Req() req: Request) {
    const userId = req.user.userId;
    return this.labelService.getUserAreas(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('area/:id')
  async deleteArea(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user.userId;
    return this.labelService.deleteArea(id, userId);
  }

}
