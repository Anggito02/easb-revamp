import { MigrationInterface, QueryRunner } from 'typeorm';
import bcrypt from 'bcryptjs';

export class SeedUsers1762602188283 implements MigrationInterface {
  name = 'SeedUsers1762602188283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const username = process.env.SEED_ADMIN_USERNAME ?? 'superadmin';
    const plain = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
    const hash = await bcrypt.hash(plain, 10);

    await queryRunner.query(
      `INSERT INTO "users" ("username","password_hash","roles")
       VALUES ($1, $2, $3)
       ON CONFLICT ("username") DO NOTHING`,
      [username, hash, ['superadmin']]
    );

    await queryRunner.query(
        `INSERT INTO "users" ("username","password_hash","roles")
            VALUES ($1, $2, $3)
            ON CONFLICT ("username") DO NOTHING`,
        ['admin', await bcrypt.hash('AdminPass123!', 10), ['admin']]
    );

    await queryRunner.query(
        `INSERT INTO "users" ("username","password_hash","roles")
            VALUES ($1, $2, $3)
            ON CONFLICT ("username") DO NOTHING`,
        ['verifikator', await bcrypt.hash('UserPass123!', 10), ['verifikator']]
    );

    await queryRunner.query(
        `INSERT INTO "users" ("username","password_hash","roles")
            VALUES ($1, $2, $3)
            ON CONFLICT ("username") DO NOTHING`,
        ['opd', await bcrypt.hash('AuditorPass123!', 10), ['opd']]
    );

    await queryRunner.query(
        `INSERT INTO "users" ("username","password_hash","roles")
            VALUES ($1, $2, $3)
            ON CONFLICT ("username") DO NOTHING`,
        ['guest', await bcrypt.hash('GuestPass123!', 10), ['guest']]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const username = process.env.SEED_ADMIN_USERNAME ?? 'superadmin';
    await queryRunner.query(`DELETE FROM "users" WHERE "username" = $1`, [username]);
  }
}