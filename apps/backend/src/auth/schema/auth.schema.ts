import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  createdAt: z.string(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UserResponse = z.infer<typeof userSchema>;
