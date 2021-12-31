import { SetMetadata } from '@nestjs/common';

export type RoleType = 'guest' | 'user' | 'maker' | 'me';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
