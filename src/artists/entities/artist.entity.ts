import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IArtist } from '../interfaces/IArtist';

@Entity('artist')
export class ArtistEntity implements IArtist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;
}
