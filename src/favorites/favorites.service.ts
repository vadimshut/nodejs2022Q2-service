import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAlbum } from 'src/albums/dto/interfaces/IAlbum';
import { IArtist } from 'src/artists/interfaces/IArtist';
import { ITrack } from 'src/tracks/interfaces/ITrack';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from './../albums/albums.service';
import { ArtistsService } from './../artists/artists.service';
import { IFavoritesResponse } from './interfaces/IFavoritesResponse';
import {
  FavoriteEntity,
  FavoriteEntityResponse,
} from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,

    @InjectRepository(FavoriteEntity)
    private favoriteRepository: Repository<FavoriteEntity>,
  ) {}

  // async getAll(): Promise<IFavoritesResponse> {
  //   const tracks: ITrack[] = await Promise.allSettled(
  //     this.favorites.tracks.map((trackId) =>
  //       this.tracksService.getById(trackId),
  //     ),
  //   ).then((res) =>
  //     res.map(
  //       (item) => ((item as unknown) as PromiseFulfilledResult<any>).value,
  //     ),
  //   );
  //   const albums: IAlbum[] = await Promise.allSettled(
  //     this.favorites.albums.map((albumId) =>
  //       this.albumsService.getById(albumId),
  //     ),
  //   ).then((res) =>
  //     res.map(
  //       (item) => ((item as unknown) as PromiseFulfilledResult<any>).value,
  //     ),
  //   );
  //   const artists: IArtist[] = await Promise.allSettled(
  //     this.favorites.artists.map((artistId) =>
  //       this.artistsService.getById(artistId),
  //     ),
  //   ).then((res) =>
  //     res.map(
  //       (item) => ((item as unknown) as PromiseFulfilledResult<any>).value,
  //     ),
  //   );
  //   return { artists, albums, tracks };
  // }

  async getFavsId(): Promise<string> {
    const favsAll = await this.favoriteRepository.find();
    if (favsAll.length) return favsAll[0].id;
    const favs = await this.favoriteRepository.save(
      this.favoriteRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      }),
    );
    return favs.id;
  }

  async getUserFavs(): Promise<FavoriteEntityResponse> {
    const tracks = [];
    const albums = [];
    const artists = [];

    const favsId = await this.getFavsId();
    const favs = await this.favoriteRepository.findOne({
      where: { id: favsId },
    });

    favs.tracks.forEach(async (trackId) => {
      try {
        const trackData = await this.tracksService.getById(trackId);
        tracks.push(trackData);
      } catch {}
    });

    favs.albums.forEach(async (albumId) => {
      try {
        const albumData = await this.albumsService.getById(albumId);
        albums.push(albumData);
      } catch {}
    });

    favs.artists.forEach(async (artistId) => {
      try {
        const artistData = await this.artistsService.getById(artistId);
        artists.push(artistData);
      } catch {}
    });

    return { ...favs, artists, albums, tracks };
  }

  async addTrack(id: string): Promise<void> {
    try {
      const { id: trackId } = await this.tracksService.getById(id);
      const favsId = await this.getFavsId();
      const favorite = await this.favoriteRepository.findOne({
        where: { id: favsId },
      });

      await this.favoriteRepository.save(
        this.favoriteRepository.create({
          ...favorite,
          tracks: [...new Set([...favorite.tracks, trackId])],
        }),
      );
      return;
    } catch {
      throw new UnprocessableEntityException();
    }
  }

  async removeItem(id: string, itemForDelete: string): Promise<void> {
    const favsId = await this.getFavsId();
    const favorite = await this.favoriteRepository.findOne({
      where: { id: favsId },
    });

    const listWithoutId = favorite[itemForDelete].filter(
      (itemId: string) => itemId !== id,
    );

    await this.favoriteRepository.save(
      this.favoriteRepository.create({
        ...favorite,
        [itemForDelete]: listWithoutId,
      }),
    );
    return;
  }

  async removeTrack(id: string): Promise<void> {
    await this.removeItem(id, 'tracks');
  }

  async addAlbum(id: string): Promise<void> {
    try {
      const favsId = await this.getFavsId();
      const { id: albumId } = await this.albumsService.getById(id);
      const favorite = await this.favoriteRepository.findOne({
        where: { id: favsId },
      });

      await this.favoriteRepository.save(
        this.favoriteRepository.create({
          ...favorite,
          albums: [...new Set([...favorite.albums, albumId])],
        }),
      );
      return;
    } catch {
      throw new UnprocessableEntityException();
    }
  }

  async removeAlbum(id: string): Promise<void> {
    await this.removeItem(id, 'albums');
  }

  async addArtist(id: string): Promise<void> {
    try {
      const favsId = await this.getFavsId();
      const { id: artistId } = await this.artistsService.getById(id);
      const favorite = await this.favoriteRepository.findOne({
        where: { id: favsId },
      });
      await this.favoriteRepository.save(
        this.favoriteRepository.create({
          ...favorite,
          artists: [...new Set([...favorite.artists, artistId])],
        }),
      );
      return;
    } catch {
      throw new UnprocessableEntityException();
    }
  }

  async removeArtist(id: string): Promise<void> {
    await this.removeItem(id, 'artists');
  }
}
