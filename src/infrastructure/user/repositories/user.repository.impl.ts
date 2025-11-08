import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../../domain/user/user.repository';
import { User } from '../../../domain/user/user.entity';
import { UserOrmEntity } from '../orm/user.orm_entity';
import { CreateUserDto } from 'src/presentation/users/dto/create_user.dto';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@InjectRepository(UserOrmEntity) private readonly repo: Repository<UserOrmEntity>) {}

    async create(user: CreateUserDto): Promise<User> {
        const row = this.repo.create(user as any);
        const saved = await this.repo.save(row);
        return { id: saved.at(0)?.id, username: saved.at(0)?.username, passwordHash: saved.at(0)?.passwordHash, roles: saved.at(0)?.roles } as User;
    }

    async findByUsername(username: string): Promise<User | null> {
        const u = await this.repo.findOne({ where: { username } });
        return u ? ({ id: u.id, username: u.username, passwordHash: u.passwordHash, roles: u.roles, refreshTokenVersion: u.refreshTokenVersion }) : null;
    }

    async findById(id: number): Promise<User | null> {
        const u = await this.repo.findOne({ where: { id } });
        return u ? ({ id: u.id, username: u.username, passwordHash: u.passwordHash, roles: u.roles, refreshTokenVersion: u.refreshTokenVersion }) : null;
    }
}
