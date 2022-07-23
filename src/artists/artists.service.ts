import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { ArtistEntity } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,

    @InjectRepository(ArtistEntity)
    private readonly artistRepository: Repository<ArtistEntity>,
  ) {}

  async getAll(): Promise<ArtistEntity[]> {
    return await this.artistRepository.find();
  }

  async getById(id: string): Promise<ArtistEntity> {
    const artist = this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException();
    return artist;
  }

  async create(artistDto: CreateArtistDto): Promise<ArtistEntity> {
    const artist = this.artistRepository.create(artistDto);
    return await this.artistRepository.save(artist);
  }

  async update(id: string, artistDto: UpdateArtistDto): Promise<ArtistEntity> {
    const artist = this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException();

    return await this.artistRepository.save(
      this.artistRepository.create({
        ...artist,
        ...artistDto,
      }),
    );
  }

  async remove(id: string): Promise<void> {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    await this.albumsService.removeArtist(id);
    await this.tracksService.removeArtist(id);
    await this.favoritesService.removeArtist(id);
    return;
  }
}
