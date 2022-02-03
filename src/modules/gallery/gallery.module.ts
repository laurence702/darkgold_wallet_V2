import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import PrismaService from '@services/prisma';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService, PrismaService],
})
export class GalleryModule {}
