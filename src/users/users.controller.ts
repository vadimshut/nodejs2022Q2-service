import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-user.dto';

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
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.usersService.create(createUserDto);
    return new UserEntity(newUser);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdatePasswordDto,
  ): Promise<UserEntity> {
    const updatedUser = await this.usersService.update(id, updateProductDto);
    return new UserEntity(updatedUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
