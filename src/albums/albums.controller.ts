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
import { AlbumEntity } from './entities/album.entity';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  getAll(): Promise<AlbumEntity[]> {
    return this.albumsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<AlbumEntity> {
    return this.albumsService.getById(id);
  }

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    return this.albumsService.create(createAlbumDto);
  }

  @Put(':id')
  update(
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AlbumEntity> {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.albumsService.remove(id);
  }
}
