import { Injectable, NotFoundException } from '@nestjs/common';
import { IArtist } from './interfaces/IArtist';
import { v4 as uuidv4 } from 'uuid';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistsService {
  private artists: IArtist[] = [];

  async getAll(): Promise<IArtist[]> {
    return this.artists;
  }

  async getById(id: string): Promise<IArtist> {
    const artist = this.artists.find((artist) => id === artist.id);
    if (!artist) throw new NotFoundException();
    return artist;
  }

  async create(artistDto: CreateArtistDto): Promise<IArtist> {
    const newArtist = {
      id: uuidv4(),
      ...artistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  async update(id: string, artistDto: UpdateArtistDto): Promise<IArtist> {
    const artist = this.artists.find((artist) => id === artist.id);
    if (!artist) throw new NotFoundException();

    let updatedArtist: IArtist | null = null;
    this.artists = this.artists.map((artist) =>
      artist.id === id
        ? (updatedArtist = {
            ...artist,
            ...artistDto,
          })
        : artist,
    );
    return updatedArtist;
  }

  async remove(id: string): Promise<void> {
    const artist = this.artists.find((artist) => id === artist.id);
    if (!artist) throw new NotFoundException();
    this.artists = this.artists.filter((artist) => artist.id !== id);
    return;
  }
}
