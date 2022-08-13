import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { ArtistsModule } from './../artists/artists.module';
import { AlbumsModule } from './../albums/albums.module';
import { FavoriteEntity } from './entities/favorite.entity';

@Module({
  providers: [FavoritesService],
  controllers: [FavoritesController],
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    TypeOrmModule.forFeature([FavoriteEntity]),
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
