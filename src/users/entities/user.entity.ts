import { IUser } from '../interfaces/IUser';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  version: number;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;

  @Column()
  hashRefreshToken: string | null;

  toResponse() {
    const { password, ...response } = this;
    return response;
  }
}
