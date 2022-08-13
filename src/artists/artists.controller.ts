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
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  getAll(): Promise<ArtistEntity[]> {
    return this.artistsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<ArtistEntity> {
    return this.artistsService.getById(id);
  }

  @Post()
  create(@Body() createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    return this.artistsService.create(createArtistDto);
  }

  @Put(':id')
  update(
    @Body() updateArtistDto: UpdateArtistDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ArtistEntity> {
    return this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.artistsService.remove(id);
  }
}
