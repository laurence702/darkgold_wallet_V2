import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { Permission } from './permissions.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      console.log('requiredPermissions', requiredPermissions);
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userToken = request.headers.authorization.slice(7);

    const decodedToken = this.jwtService.decode(userToken);
    // console.log('decodedToken', decodedToken);
    const user = JSON.stringify(decodedToken);
    // console.log('user', JSON.stringify(user));


    return requiredPermissions.some((permission) => user.includes(permission));
  }
}
