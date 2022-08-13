import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { ITokens } from './interfaces/ITokens';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

config();

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup({ login, password }: AuthDto): Promise<ITokens> {
    const hash = this.encodePassword(password);
    const newUser = await this.usersService.create({
      login: login,
      password: hash,
    });

    const tokens = await this.getTokens(newUser.id, newUser.login);
    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async signin(authDto: AuthDto): Promise<ITokens> {
    const user = await this.usersService.getByUsername(authDto.login);
    if (!user) throw new ForbiddenException('Access Denied');
    const isComparedPasswords = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!isComparedPasswords) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<ITokens> {
    const user = await this.usersService.getById(userId);
    if (!user || !user.hashRefreshToken)
      throw new ForbiddenException('Access Denied');

    const isComparedRefreshToken = await bcrypt.compare(
      user.hashRefreshToken,
      refreshToken,
    );
    if (!isComparedRefreshToken) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = this.encodePassword(refreshToken);
    await this.usersService.updateHashRefreshToken(userId, hash);
  }

  async getTokens(userId: string, email: string): Promise<ITokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    ]);

    return { accessToken, refresh_token };
  }

  encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(+process.env.CRYPT_SALT);
    return bcrypt.hashSync(password, salt);
  }
}
