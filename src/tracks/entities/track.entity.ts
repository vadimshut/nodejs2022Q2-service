import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ITrack } from '../interfaces/ITrack';

@Entity('track')
export class TrackEntity implements ITrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  artistId: string | null;

  @Column()
  albumId: string | null;

  @Column()
  duration: number;
}
