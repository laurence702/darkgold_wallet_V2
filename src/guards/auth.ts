import { User } from '.prisma/client';
import { UserAuthService } from '@modules/user/service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { retrieveTokenValue } from '@utils/jwt';

@Injectable()
class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserAuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request.user = await this.getAuth(request);
    return true;
  }

  async getAuth(req: any): Promise<User> {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split('Bearer')[1].trim();
    }

    if (!token) throw new BadRequestException('Invalid Authorization Token');

    const { userID, iat } = await retrieveTokenValue<{ userID: string }>(token);

    const user = await this.userService.findByUid(userID);

    if (!user)
      throw new UnauthorizedException(
        'The user belonging to this token no longer exist',
      );

    // if (this.userService.userChangedPassword(user, iat))
    //   throw new UnauthorizedException(
    //     'User recently changed password! Please log in again.',
    //   );

    return user;
  }
}

export default AuthGuard;
