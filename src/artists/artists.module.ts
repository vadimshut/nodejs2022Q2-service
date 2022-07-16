import { Module, forwardRef } from '@nestjs/common';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

@Module({
  providers: [ArtistsService],
  controllers: [ArtistsController],
  imports: [forwardRef(() => AlbumsModule), forwardRef(() => TracksModule)],
  exports: [ArtistsService],
})
export class ArtistsModule {}
