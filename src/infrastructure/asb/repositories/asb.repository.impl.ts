import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { AsbRepository } from '../../../domain/asb/asb.repository';
import { AsbOrmEntity } from '../orm/asb.orm_entity';
import { Asb } from '../../../domain/asb/asb.entity';

@Injectable()
export class AsbRepositoryImpl implements AsbRepository {
    constructor(
        @InjectRepository(AsbOrmEntity)
        private repo: Repository<AsbOrmEntity>,
    ) {}

    async create(asb: Asb): Promise<Asb> {
        const entity = this.repo.create(
            plainToInstance(AsbOrmEntity, asb),
        );
        const saved = await this.repo.save(entity);

        return plainToInstance(Asb, saved);
    }
}
