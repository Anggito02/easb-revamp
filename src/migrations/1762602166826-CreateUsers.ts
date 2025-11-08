import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1762602166826 implements MigrationInterface {
  name = 'CreateUsers1762602166826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR(50) NOT NULL UNIQUE,
        "password_hash" VARCHAR(255) NOT NULL,
        "roles" TEXT[] NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ NULL
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users" ("username");
    `);

    // trigger update updated_at (optional tapi praktis di sisi DB)
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_users_updated_at') THEN
          CREATE TRIGGER set_users_updated_at
          BEFORE UPDATE ON "users"
          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_users_updated_at ON "users";`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_username";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}