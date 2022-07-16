import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/IUser';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private users: IUser[] = [];

  async getAll(): Promise<IUser[]> {
    return this.users;
  }

  async getById(id: string): Promise<IUser> {
    const user = this.users.find((user) => id === user.id);
    if (user) return user;
    throw new NotFoundException();
  }

  async create(userDto: CreateUserDto): Promise<IUser> {
    const createTime = Date.now();
    const newUser = {
      id: uuidv4(),
      ...userDto,
      version: 1,
      createdAt: createTime,
      updatedAt: createTime,
    };

    this.users.push(newUser);
    return newUser;
  }
}
