import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from './../albums/albums.service';
import { ArtistsService } from './../artists/artists.service';
import {
  FavoriteEntity,
  FavoriteEntityResponse,
} from './entities/favorite.entity';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { ArtistEntity } from 'src/artists/entities/artist.entity';
import { TrackEntity } from 'src/tracks/entities/track.entity';

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

  async getFavsId(): Promise<string> {
    const favsAll = await this.favoriteRepository.find();
    if (favsAll.length) return favsAll[0].id;
    const favorites = await this.favoriteRepository.save(
      this.favoriteRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      }),
    );
    return favorites.id;
  }

  async resolveById(
    idsList: string[],
    serviceName: string,
  ): Promise<TrackEntity[] | AlbumEntity[] | ArtistEntity[]> {
    const services = {
      tracks: this.tracksService,
      albums: this.albumsService,
      artists: this.artistsService,
    };
    const result = [];

    for (const id of idsList) {
      try {
        const data = await services[serviceName].getById(id);
        result.push(data);
      } catch {}
    }
    return result;
  }

  async getUserFavs(): Promise<FavoriteEntityResponse> {
    const favsId = await this.getFavsId();
    const favorites = await this.favoriteRepository.findOne({
      where: { id: favsId },
    });

    const tracks = await this.resolveById(favorites.tracks, 'tracks');
    const albums = await this.resolveById(favorites.albums, 'albums');
    const artists = await this.resolveById(favorites.artists, 'artists');

    return {
      id: favsId,
      artists: artists as ArtistEntity[],
      albums: albums as AlbumEntity[],
      tracks: tracks as TrackEntity[],
    };
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
