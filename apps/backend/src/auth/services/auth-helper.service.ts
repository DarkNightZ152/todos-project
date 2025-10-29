import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithCookies, UserPayload } from '../jwt/types/auth.types';

@Injectable()
export class AuthHelperService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyRequest(req: RequestWithCookies): Promise<UserPayload> {
    const token =
      req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const decoded = await this.jwtService.verifyAsync<UserPayload>(token);
      return { userId: decoded.userId, email: decoded.email };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
