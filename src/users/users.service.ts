import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { name, email, cpf, password, role } = createUserDto;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    const userWithSameCpf = await this.prisma.user.findUnique({
      where: { cpf },
    });

    if (userWithSameCpf || userWithSameEmail) {
      throw new Error('This user already exists');
    }

    const passwordCrypted = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        cpf,
        role,
        password: passwordCrypted,
      },
    });

    return { id: newUser.id };
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { name, password } = updateUserDto;

    if (this.findOne(id) === null) {
      throw new Error("This user don't exist");
    }

    const passwordCrypted = await bcrypt.hash(password, 10);

    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        name,
        password: passwordCrypted,
      },
    });

    return { id: updateUser.id };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
