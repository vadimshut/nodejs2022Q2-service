import { IAlbum } from 'src/albums/dto/interfaces/IAlbum';
import { IArtist } from 'src/artists/interfaces/IArtist';
import { ITrack } from 'src/tracks/interfaces/ITrack';

export interface IFavoritesResponse {
  artists: IArtist[];
  albums: IAlbum[];
  tracks: ITrack[];
}
