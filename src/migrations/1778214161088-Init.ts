import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778214161088 implements MigrationInterface {
    name = 'Init1778214161088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isEmailVerified\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isEmailVerified\``);
    }

}
