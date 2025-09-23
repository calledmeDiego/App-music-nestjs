import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<('user' | 'admin')[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ]);
        
        if (!requiredRoles) {
            return true;
        }

        const { user } =context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('Usuario no autenticado');
        }

        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            throw new ForbiddenException('No tienes permisos para esta acción')
        }

        return true;
    }
}