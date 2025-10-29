import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  RequestWithCookies,
  RequestWithUser,
} from './types/auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithCookies & Partial<RequestWithUser>>();

    const token =
      request.cookies?.token ||
      request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = { userId: decoded.userId, email: decoded.email };
      return true;
    } catch {
      return false;
    }
  }
}
