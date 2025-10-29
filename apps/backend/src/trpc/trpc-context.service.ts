import { Injectable } from '@nestjs/common';
import { TRPCContext } from 'nestjs-trpc';
import { RequestWithCookies } from '../auth/jwt/types/auth.types';

export interface TrpcContextType extends Record<string, unknown> {
  req: RequestWithCookies;
}

@Injectable()
export class TrpcContextService implements TRPCContext {
  create(opts: { req: RequestWithCookies }): TrpcContextType {
    return {
      req: opts.req,
    };
  }
}
