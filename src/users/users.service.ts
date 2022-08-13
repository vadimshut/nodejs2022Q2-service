import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<Omit<UserEntity, 'password' | 'toResponse'>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => user.toResponse());
  }

  async getById(
    id: string,
  ): Promise<Omit<UserEntity, 'password' | 'toResponse'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) return user.toResponse();
    throw new NotFoundException();
  }

  async getByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { login: username },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async create(
    userDto: CreateUserDto,
  ): Promise<Omit<UserEntity, 'password' | 'toResponse'>> {
    const createTime = Date.now();
    const newUser = {
      ...userDto,
      version: 1,
      createdAt: createTime,
      updatedAt: createTime,
    };

    const user = this.userRepository.create(newUser);
    return (await this.userRepository.save(user)).toResponse();
  }

  async update(
    id: string,
    userDto: UpdatePasswordDto,
  ): Promise<Omit<UserEntity, 'password' | 'toResponse'>> {
    const { oldPassword, newPassword } = userDto;
    const updatedAt = Date.now();
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    return (
      await this.userRepository.save(
        this.userRepository.create({
          ...user,
          password: newPassword,
          version: user.version + 1,
          createdAt: +user.createdAt,
          updatedAt: updatedAt,
        }),
      )
    ).toResponse();
  }

  async updateHashRefreshToken(id: string, hash: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    await this.userRepository.save(
      this.userRepository.create({
        ...user,
        hashRefreshToken: hash,
      }),
    );
    return;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
