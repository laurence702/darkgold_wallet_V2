import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto, UpdateGalleryDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import UserRolesGuard from '@guards/roles';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { USER_ROLES } from '.prisma/client';
import { UserRoles } from '@utils/decorators/auth';

@Controller('gallery')
//@UseGuards(JwtAuthGuard, UserRolesGuard)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return new BadRequestException({
        status: 'failed',
        message: 'file is required',
      });
    }
    return this.galleryService.create(file);
  }

  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(+id);
  }
}
