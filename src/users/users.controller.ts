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
  async getAll(): Promise<Omit<UserEntity, 'password' | 'toResponse'>[]> {
    return await this.usersService.getAll();
  }

  @Get(':id')
  async getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Omit<UserEntity, 'password' | 'toResponse'>> {
    return await this.usersService.getById(id);
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<UserEntity, 'password' | 'toResponse'>> {
    return await this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdatePasswordDto,
  ): Promise<Omit<UserEntity, 'password' | 'toResponse'>> {
    return await this.usersService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
