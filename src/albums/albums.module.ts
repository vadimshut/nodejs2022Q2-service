import { Module, forwardRef } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
@Module({
  providers: [AlbumsService],
  controllers: [AlbumsController],
  imports: [],
  exports: [AlbumsService],
})
export class AlbumsModule {}
