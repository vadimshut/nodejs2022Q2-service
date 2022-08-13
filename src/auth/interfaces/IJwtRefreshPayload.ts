import { IJwtPayload } from './IJwtPayload';

export interface IJwtRefreshPayload extends IJwtPayload {
  refreshToken: string;
}
