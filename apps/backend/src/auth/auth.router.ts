import { Input, Mutation, Router } from 'nestjs-trpc';
import { z } from 'zod';
import {
  SignInInput,
  signInSchema,
  SignUpInput,
  signUpSchema,
} from './schema/auth.schema';
import { AuthService } from './services/auth.service';

@Router({ alias: 'auth' })
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({
    input: signUpSchema,
    output: z.object({
      user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string(),
        createdAt: z.string(),
      }),
      token: z.string(),
    }),
  })
  async signUp(@Input() signUpData: SignUpInput) {
    return this.authService.signUp(signUpData);
  }

  @Mutation({
    input: signInSchema,
    output: z.object({
      user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string(),
        createdAt: z.string(),
      }),
      token: z.string(),
    }),
  })
  async signIn(@Input() signInData: SignInInput) {
    return this.authService.signIn(signInData);
  }
}
