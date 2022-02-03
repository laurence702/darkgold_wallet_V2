import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import PrismaService from '@services/prisma';
import { CreateGalleryDto, UpdateGalleryDto } from './dto';
import { Express } from 'express';
import { fileUpload } from '../../utils/helper';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(file: Express.Multer.File) {
    try {
      const uploadedFile = await fileUpload(file);
      console.log(uploadedFile);
      const imageName = uploadedFile.message;
      const imageUpload = await this.prisma.gallery.create({
        data: { imageName },
      });
      if (!imageUpload) {
        throw new BadRequestException({
          status: 'failed',
          message: 'Asset could not be uploaded',
        });
      }
      return {
        status: 'success',
        message: 'Image uploaded successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.gallery.findMany();
      if (data) {
        const imagePath = process.env.IMG_PATH;

        const payload = { data, imagePath };
        return {
          status: 'success',
          message: payload,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    const dataFound = await this.prisma.gallery.findUnique({
      where: { id },
    });
    if (dataFound) {
      return {
        status: 'success',
        message: {
          data: dataFound,
        },
      };
    }
    throw new HttpException(`failed`, HttpStatus.NOT_FOUND);
  }
}
