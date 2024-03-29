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
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';

import { TracksService } from './tracks.service';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  getAll(): Promise<TrackEntity[]> {
    return this.tracksService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<TrackEntity> {
    return this.tracksService.getById(id);
  }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto): Promise<TrackEntity> {
    return this.tracksService.create(createTrackDto);
  }

  @Put(':id')
  update(
    @Body() updateTrackDto: UpdateTrackDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TrackEntity> {
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.tracksService.remove(id);
  }
}
