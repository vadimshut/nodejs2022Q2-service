import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksService } from 'src/tracks/tracks.service';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,

    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) {}

  async getAll(): Promise<AlbumEntity[]> {
    return await this.albumRepository.find();
  }

  async getById(id: string): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) throw new NotFoundException();
    return album;
  }

  async create(albumDto: CreateAlbumDto): Promise<AlbumEntity> {
    const newAlbum = this.albumRepository.create(albumDto);
    return await this.albumRepository.save(newAlbum);
  }

  async update(id: string, albumDto: UpdateAlbumDto): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) throw new NotFoundException();

    return await this.albumRepository.save(
      this.albumRepository.create({
        ...album,
        ...albumDto,
      }),
    );
  }

  async removeArtist(id: string): Promise<void> {
    const albums = await this.getAll();
    albums.forEach(async (album) => {
      if (album.artistId === id) {
        await this.update(album.id, { ...album, artistId: null });
      }
    });
    return;
  }

  async remove(id: string): Promise<void> {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    await this.tracksService.removeAlbums(id);
    await this.favoritesService.removeAlbum(id);
    return;
  }
}
