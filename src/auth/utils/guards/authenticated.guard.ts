import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/** Check if there is a session for the user making the request  */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
