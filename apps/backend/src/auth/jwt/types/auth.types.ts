export interface JwtPayload {
  userId: string;
  email: string;
}

export interface UserPayload {
  userId: string;
  email: string;
}

export interface RequestWithUser {
  user: UserPayload;
}

export interface RequestWithCookies {
  cookies?: { token?: string };
  headers: { authorization?: string };
}
