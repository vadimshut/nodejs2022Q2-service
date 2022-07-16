import { Exclude } from 'class-transformer';
import { IUser } from '../interfaces/IUser';

export class UserEntity implements IUser {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
