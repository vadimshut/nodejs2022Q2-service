import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IAlbum } from '../dto/interfaces/IAlbum';

@Entity('album')
export class AlbumEntity implements IAlbum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  artistId: string | null;
}
