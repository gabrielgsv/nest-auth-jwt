import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getAll() {
    const allUsers = await this.prisma.user.findMany();

    await allUsers.forEach((user, index) => {
      user.password = undefined;
      allUsers[index] = user;
    });

    return allUsers;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return `Remove user with id: ${id}`;
  }
}
