import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtRefreshPayload } from '../interfaces/IJwtRefreshPayload';

export const GetCurrentUser = createParamDecorator(
  (data: keyof IJwtRefreshPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
