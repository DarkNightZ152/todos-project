import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthRouter } from './auth.router';
import { AuthGuard } from './jwt/auth.guard';
import { JwtStrategy } from './jwt/jwt.strategy';
import { User, UserSchema } from './schema/user.entity';
import { AuthHelperService } from './services/auth-helper.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthService,
    AuthRouter,
    AuthGuard,
    JwtStrategy,
    AuthHelperService,
  ],
  exports: [AuthService, AuthGuard, JwtModule, AuthHelperService],
})
export class AuthModule {}
