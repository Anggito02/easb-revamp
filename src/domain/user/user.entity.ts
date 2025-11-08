import { Role } from "./user_role.enum";

export class User {
  id!: number | string;
  username!: string;
  passwordHash?: string; // jangan expose keluar layer
  roles!: Role[];
}