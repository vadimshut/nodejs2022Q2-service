import { Module, forwardRef } from '@nestjs/common';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

@Module({
  providers: [AlbumsService],
  controllers: [AlbumsController],
  imports: [forwardRef(() => TracksModule), forwardRef(() => FavoritesModule)],
  exports: [AlbumsService],
})
export class AlbumsModule {}
