import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksService } from 'src/tracks/tracks.service';

import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { IAlbum } from './dto/interfaces/IAlbum';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  private albums: IAlbum[] = [];

  async getAll(): Promise<IAlbum[]> {
    return this.albums;
  }

  async getById(id: string): Promise<IAlbum> {
    const album = this.albums.find((album) => id === album.id);
    if (!album) throw new NotFoundException();
    return album;
  }

  async create(albumDto: CreateAlbumDto): Promise<IAlbum> {
    const newAlbum = {
      id: uuidv4(),
      ...albumDto,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  async update(id: string, albumDto: UpdateAlbumDto): Promise<IAlbum> {
    const album = this.albums.find((album) => id === album.id);
    if (!album) throw new NotFoundException();

    let updatedAlbum: IAlbum | null = null;
    this.albums = this.albums.map((album) =>
      album.id === id
        ? (updatedAlbum = {
            ...album,
            ...albumDto,
          })
        : album,
    );
    return updatedAlbum;
  }

  async removeArtist(id: string): Promise<void> {
    this.albums = this.albums.map((album) =>
      album.artistId === id ? { ...album, artistId: null } : album,
    );
    return;
  }

  async remove(id: string): Promise<IAlbum> {
    const album = this.albums.find((album) => id === album.id);
    if (!album) throw new NotFoundException();

    await this.tracksService.removeAlbums(id);
    await this.favoritesService.removeAlbum(id);
    this.albums = this.albums.filter((album) => album.id !== id);
    return;
  }
}
