import { Role } from 'src/domain/user/user_role.enum';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { sub: string; username: string; roles: Role[]; userId?: string };
  }
}