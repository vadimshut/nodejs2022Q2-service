import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IAlbum } from 'src/albums/dto/interfaces/IAlbum';
import { IArtist } from 'src/artists/interfaces/IArtist';
import { ITrack } from 'src/tracks/interfaces/ITrack';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from './../albums/albums.service';
import { ArtistsService } from './../artists/artists.service';

import { IFavorites } from './interfaces/IFavorites';
import { IFavoritesResponse } from './interfaces/IFavoritesResponse';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  private favorites: IFavorites = { tracks: [], albums: [], artists: [] };

  async getAll(): Promise<IFavoritesResponse> {
    const tracks: ITrack[] = await Promise.allSettled(
      this.favorites.tracks.map((trackId) =>
        this.tracksService.getById(trackId),
      ),
    ).then((res) =>
      res.map((item) => (item as unknown as PromiseFulfilledResult<any>).value),
    );
    const albums: IAlbum[] = await Promise.allSettled(
      this.favorites.albums.map((albumId) =>
        this.albumsService.getById(albumId),
      ),
    ).then((res) =>
      res.map((item) => (item as unknown as PromiseFulfilledResult<any>).value),
    );
    const artists: IArtist[] = await Promise.allSettled(
      this.favorites.artists.map((artistId) =>
        this.artistsService.getById(artistId),
      ),
    ).then((res) =>
      res.map((item) => (item as unknown as PromiseFulfilledResult<any>).value),
    );
    return { artists, albums, tracks };
  }

  async addTrack(id: string): Promise<void> {
    try {
      await this.tracksService.getById(id);
    } catch {
      throw new UnprocessableEntityException();
    }
    this.favorites.tracks.push(id);
    return;
  }

  async removeTrack(id: string): Promise<void> {
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
    return;
  }

  async addAlbum(id: string): Promise<void> {
    try {
      await this.albumsService.getById(id);
    } catch {
      throw new UnprocessableEntityException();
    }
    this.favorites.albums.push(id);
    return;
  }

  async removeAlbum(id: string): Promise<void> {
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
    return;
  }

  async addArtist(id: string): Promise<void> {
    try {
      await this.artistsService.getById(id);
    } catch {
      throw new UnprocessableEntityException();
    }
    this.favorites.artists.push(id);
    return;
  }

  async removeArtist(id: string): Promise<void> {
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    return;
  }
}
