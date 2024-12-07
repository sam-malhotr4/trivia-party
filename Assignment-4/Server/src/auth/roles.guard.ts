import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('Required Roles:', requiredRoles); 

    if (!requiredRoles) {
      return true; 
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('User Object in Request:', user); 

    if (!user || !user.roles) {
      console.error('User or roles missing in request');
      return false;
    }

    const hasRole = requiredRoles.some(role => user.roles.includes(role));
    console.log('User Has Required Role:', hasRole); 
    return hasRole;
  }
}
