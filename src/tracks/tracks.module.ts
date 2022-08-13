import { Module, forwardRef } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  providers: [TracksService],
  controllers: [TracksController],
  exports: [TracksService],
  imports: [forwardRef(() => FavoritesModule)],
})
export class TracksModule {}
