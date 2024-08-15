import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(createHotelDto: CreateHotelDto) {
    const { name, cnpj, description, ownerid } = createHotelDto;

    const hasOwnerId = await this.prisma.user.findUnique({
      where: {
        id: ownerid,
      },
    });

    if (hasOwnerId === null) {
      throw new Error("User don't exist");
    }

    const hotelExists = await this.prisma.hotel.findUnique({
      where: { cnpj },
    });

    if (hotelExists) {
      throw new Error('Hotel already exits');
    }

    const newHotel = await this.prisma.hotel.create({
      data: {
        name,
        cnpj,
        description,
        ownerid,
      },
    });
    return { id: newHotel.id };
  }

  findAll() {
    return `This action returns all hotels`;
  }

  async findOne(id: number) {
    const hotelFound = await this.prisma.hotel.findUnique({ where: { id } });

    return hotelFound;
  }

  async update(id: number, updateHotelDto: UpdateHotelDto) {
    const hotelFound = await this.findOne(id);

    if (!hotelFound) {
      throw new NotFoundException();
    }

    const hotelUpdated = await this.prisma.hotel.update({
      where: { id },
      data: {
        ...updateHotelDto,
      },
    });

    return hotelUpdated;
  }

  remove(id: number) {
    return `This action removes a #${id} hotel`;
  }
}
