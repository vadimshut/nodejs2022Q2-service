import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IFavorites } from '../interfaces/IFavorites';

@Entity('favs')
export class FavoriteEntity implements IFavorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}
