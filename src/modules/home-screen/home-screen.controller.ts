import { Controller, Get, Post, Body, Query, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
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
  async findAll(@Req() req: Request, @Query('address') address: string) {
    const userId = req.user?.userId;
    const joblist= await this.homeScreenService.findAll(userId, address);
    return joblist
  }

  @Get('project-status')
  async peojectStatus(@Req() req:Request){
   
    const userId = req.user?.userId;
    const response = await this.homeScreenService.projectStatus(userId);
    return response 
  }

  @Get(':id')
  async findOne(@Req() req:Request, @Param('id') id: string) {
    const userId = req.user?.userId;
    const response = this.homeScreenService.findOne(id, userId);
    return response
  }


}
