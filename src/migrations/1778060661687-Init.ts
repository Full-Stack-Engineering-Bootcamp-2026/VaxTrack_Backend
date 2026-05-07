import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778060661687 implements MigrationInterface {
    name = 'Init1778060661687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageUrl\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageUrl\``);
    }

}
