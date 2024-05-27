import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenStrategy } from './stratagies/accessToken.strategy';
import { RefreshTokenStrategy } from './stratagies/refreshToken.strategy';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    JwtService,
    PrismaService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
