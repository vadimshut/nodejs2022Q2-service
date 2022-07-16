import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from 'src/favorites/favorites.service';

import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrack } from './interfaces/ITrack';

@Injectable()
export class TracksService {
  private tracks: ITrack[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}
  
  async getAll(): Promise<ITrack[]> {
    return this.tracks;
  }

  async getById(id: string): Promise<ITrack> {
    const track = this.tracks.find((track) => id === track.id);
    if (!track) throw new NotFoundException();
    return track;
  }

  async create(trackDto: CreateTrackDto): Promise<ITrack> {
    const newTrack = {
      id: uuidv4(),
      ...trackDto,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  

  async update(id: string, trackDto: UpdateTrackDto): Promise<ITrack> {
    const track = this.tracks.find((track) => id === track.id);
    if (!track) throw new NotFoundException();

    let updatedTrack: ITrack | null = null;
    this.tracks = this.tracks.map((track) =>
      track.id === id
        ? (updatedTrack = {
            ...track,
            ...trackDto,
          })
        : track,
    );
    return updatedTrack;
  }

  async removeArtist(id: string): Promise<void> {
    this.tracks = this.tracks.map((track) =>
      track.artistId === id ? { ...track, artistId: null } : track,
    );
    return;
  }

  async removeAlbums(id: string): Promise<void> {
    this.tracks = this.tracks.map((track) =>
      track.albumId === id ? { ...track, albumId: null } : track,
    );
    return;
  }

  async remove(id: string): Promise<ITrack> {
    const track = this.tracks.find((track) => id === track.id);
    if (!track) throw new NotFoundException();

    await this.favoritesService.removeTrack(id);
    this.tracks = this.tracks.filter((track) => track.id !== id);
    return;
  }
}
