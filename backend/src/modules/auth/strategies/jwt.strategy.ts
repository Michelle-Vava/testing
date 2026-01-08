import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Try Authorization header first (most reliable if sent)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Fallback to cookie (if we want to support cookie-only access)
        // Note: browser clients using Bearer tokens won't send this cookie usually
        (request: Request) => {
          return request?.cookies?.access_token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email, roles: payload.roles || ['owner'] };
  }
}
