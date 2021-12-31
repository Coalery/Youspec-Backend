import { SetMetadata } from '@nestjs/common';

export type RoleType = 'guest' | 'user' | 'maker';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
