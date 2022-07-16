import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { IAlbum } from './dto/interfaces/IAlbum';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  getAll(): Promise<IAlbum[]> {
    return this.albumsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<IAlbum> {
    return this.albumsService.getById(id);
  }

  @Post()
  create(@Body() CreateAlbumDto: CreateAlbumDto): Promise<IAlbum> {
    return this.albumsService.create(CreateAlbumDto);
  }

  @Put(':id')
  update(
    @Body() UpdateAlbumDto: UpdateAlbumDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IAlbum> {
    return this.albumsService.update(id, UpdateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<IAlbum> {
    return this.albumsService.remove(id);
  }
}
