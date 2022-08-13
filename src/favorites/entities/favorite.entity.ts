import { AlbumEntity } from 'src/albums/entities/album.entity';
import { ArtistEntity } from 'src/artists/entities/artist.entity';
import { TrackEntity } from 'src/tracks/entities/track.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IFavorites } from '../interfaces/IFavorites';
import { IFavoritesResponse } from '../interfaces/IFavoritesResponse';

@Entity('favs')
export class FavoriteEntity implements IFavorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-array')
  artists: string[];

  @Column('simple-array')
  albums: string[];

  @Column('simple-array')
  tracks: string[];
}

export class FavoriteEntityResponse implements IFavoritesResponse {
  id: string;
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}
