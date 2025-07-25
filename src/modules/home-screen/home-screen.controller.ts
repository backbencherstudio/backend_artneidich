import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { HomeScreenService } from './home-screen.service';
import { CreateHomeScreenDto } from './dto/create-home-screen.dto';
import { UpdateHomeScreenDto } from './dto/update-home-screen.dto';
import { MessageModule } from '../chat/message/message.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('home-screen')
@UseGuards(JwtAuthGuard)
export class HomeScreenController {
  constructor(private readonly homeScreenService: HomeScreenService) {}

  @Get()
  async findAll(@Req() req: Request) {
    try {
      const userId = req.user?.userId;
      return this.homeScreenService.findAll(userId);
    } catch (error) {
      return {
        success:false,
        message: error.message
      }
    }
  }

  @Get('project-status')
  async peojectStatus(@Req() req:Request){
    try {
      const userId = req.user?.userId;
      return this.homeScreenService.projectStatus(userId);
    } catch (error) {
      return {
        success:false,
        message:error.message
      }
    }
  }

  @Get(':id')
  async findOne(@Req() req:Request, @Param('id') id: string) {
    try {
      const userId = req.user?.userId;
      return this.homeScreenService.findOne(id, userId);
    } catch (error) {
      return {
        success:false,
        message:error.message
      }
    }
  }


}
