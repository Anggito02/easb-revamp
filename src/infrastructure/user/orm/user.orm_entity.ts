import { Role } from 'src/domain/user/user_role.enum';

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column('simple-array', { default: '' })
  roles!: Role[]; // simpan sebagai 'admin,superadmin' dsb.
}
