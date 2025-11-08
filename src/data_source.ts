import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // SESUAIKAN dengan penamaan file entity kamu (sudah kita sarankan pakai *.orm-entity.ts)
  entities: ['src/infrastructure/**/orm/*.orm_entity.ts'],

  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',

  // optional, tapi sangat disarankan agar snake_case konsisten
  namingStrategy: new SnakeNamingStrategy(),

  // Tidak pakai synchronize di CLI; migrasi yang handle
  synchronize: false,
  logging: ['error', 'warn'],
});