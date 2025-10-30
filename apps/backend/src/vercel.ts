import { NestFactory } from '@nestjs/core';
import { VercelRequest, VercelResponse } from '@vercel/node';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

let cachedApp: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: true,
      credentials: true,
    });
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }

  return cachedApp(req, res);
}
