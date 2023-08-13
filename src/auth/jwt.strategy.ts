import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  forwardRef,
  Inject,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt.dto';
import { Request } from 'express';
import { User } from '../users/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.parseCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
    });
  }

  static parseCookies(
    @Req() request: Request & { subscribedUserToken: string }
  ): string | null {
    const token = null;
    const key = 'token';

    // If user is trying to subscribe, request has been altered
    // in gql-config.service.ts
    if (request.subscribedUserToken) {
      return request.subscribedUserToken;
    }

    if (request && request.cookies && request.cookies[key]) {
      return request.cookies[key];
    }

    console.log('Invalid token');

    return token;
  }

  async validate(request: Request, payload: JwtDto): Promise<User> {
    const user = await this.authService.validateUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const activeProjectKey = this.configService.get('cookies').activeProjectKey;

    let projectId = 0;
    if (typeof request.header === 'function') {
      projectId = Number(request.header(activeProjectKey));
    } else {
      // Request is coming from subscription, headers location is different
      // A subscription is not bind to a certain project, so we don't need this
      // here.
    }

    return { ...user };
  }
}
