import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ITrack } from '../interfaces/ITrack';

@Entity('track')
export class TrackEntity implements ITrack {
  id: string;
  name: string;
  artistId: string;
  albumId: string;
  duration: number;
}
