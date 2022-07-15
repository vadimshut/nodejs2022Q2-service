import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { IUser } from './interfaces/IUser';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): Promise<IUser[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<IUser> {
    return this.usersService.getById(id);
  }
}
