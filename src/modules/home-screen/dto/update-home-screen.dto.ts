import { PartialType } from '@nestjs/swagger';
import { CreateHomeScreenDto } from './create-home-screen.dto';

export class UpdateHomeScreenDto extends PartialType(CreateHomeScreenDto) {}
