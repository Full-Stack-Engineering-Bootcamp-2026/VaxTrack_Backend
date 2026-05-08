import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778241449842 implements MigrationInterface {
    name = 'Init1778241449842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageUrl\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageUrl\` varchar(10000) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageUrl\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageUrl\` varchar(255) NULL`);
    }

}
