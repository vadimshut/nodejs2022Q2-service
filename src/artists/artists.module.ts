import { Module, forwardRef } from '@nestjs/common';
import { AlbumsModule } from 'src/albums/albums.module';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

@Module({
  providers: [ArtistsService],
  controllers: [ArtistsController],
  imports: [forwardRef(() => AlbumsModule)],
  exports: [ArtistsService],
})
export class ArtistsModule {}
