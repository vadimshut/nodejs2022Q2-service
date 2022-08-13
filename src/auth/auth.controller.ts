import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { AuthService } from './auth.service';
import { GetCurrentUser } from './decorators/getCurrentUser';
import { GetCurrentUserId } from './decorators/getCurrentUserId';
import { AuthDto } from './dto/auth.dto';
import { ITokens } from './interfaces/ITokens';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() authDto: AuthDto): Promise<ITokens> {
    return this.authService.signup(authDto);
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  signin(@Body() authDto: AuthDto): Promise<ITokens> {
    return this.authService.signin(authDto);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<ITokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
