import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpInputDto } from './dto/signupInput.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignInInputDto } from './dto/signinInput.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  findOne(id: number) {
    return id;
  }

  async signup(signUpInput: SignUpInputDto) {
    const hashedPassword = await argon.hash(signUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        username: signUpInput.username,
        hashedPassword,
        email: signUpInput.email,
      },
    });
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async signIn(signInInput: SignInInputDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: signInInput.email },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const doPasswordsMatch = await argon.verify(
      user.hashedPassword,
      signInInput.password,
    );

    if (!doPasswordsMatch) {
      throw new ForbiddenException('Access Denied');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user };
  }

  async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      { userId, email },
      {
        expiresIn: '1h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '1h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: { hashedRefreshToken: null },
    });

    return { loggedOut: true };
  }

  async getNewTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const doTokensMatch = await argon.verify(user.hashedRefreshToken, rt);

    if (!doTokensMatch) {
      throw new ForbiddenException('Access Denied');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }
}
