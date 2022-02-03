import { USER_ROLES_KEY } from '@constants/auth';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLES } from '@prisma/client';

@Injectable()
class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<USER_ROLES[]>(
      USER_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log(requiredRoles);

    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();

    req.isAdmin = req.user.type === USER_ROLES.ADMIN;
    req.isGuest = req.user.type === USER_ROLES.GUEST;
    req.isMember = req.user.type === USER_ROLES.MEMBER;

    if (!requiredRoles.some((role) => req.user.type === role))
      throw new ForbiddenException(
        'User role does not have right access to this resource',
      );

    return true;
  }
}

export default UserRolesGuard;
