import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { IUser } from './interfaces/IUser';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<UserEntity[]> {
    const users = await this.usersService.getAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  async getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserEntity> {
    const user = await this.usersService.getById(id);
    return new UserEntity(user);
  }

  @Post()
  async create(@Body() CreateUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.usersService.create(CreateUserDto);
    return new UserEntity(newUser);
  }
}
