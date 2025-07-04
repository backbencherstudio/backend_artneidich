import { Module } from '@nestjs/common';
import { HomeScreenService } from './home-screen.service';
import { HomeScreenController } from './home-screen.controller';

@Module({
  controllers: [HomeScreenController],
  providers: [HomeScreenService],
})
export class HomeScreenModule {}
