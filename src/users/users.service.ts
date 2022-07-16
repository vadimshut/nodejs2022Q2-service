import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/IUser';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/update-user.dto';

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

  async update(id: string, userDto: UpdatePasswordDto): Promise<IUser> {
    const { oldPassword, newPassword } = userDto;
    let updatedUser: IUser | null = null;

    const updatedAt = Date.now();
    const user = this.users.find((user) => id === user.id);
    if (!user) throw new NotFoundException();

    if (user.password !== oldPassword) {
      throw new ForbiddenException('oldPassword is wrong');
    }

    this.users = this.users.map((user) =>
      user.id === id
        ? (updatedUser = {
            ...user,
            password: newPassword,
            version: user.version + 1,
            updatedAt,
          })
        : user,
    );

    return updatedUser;
  }
}
