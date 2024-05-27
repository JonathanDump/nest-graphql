import { JwtPayload } from 'jsonwebtoken';

export type TJwtPayload = {
  email: string;
  userId: number;
};

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
