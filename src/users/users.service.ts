import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './interfaces/IUser';

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
}
