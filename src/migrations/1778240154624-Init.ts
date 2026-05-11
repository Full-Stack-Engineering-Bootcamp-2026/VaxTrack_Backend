import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778240154624 implements MigrationInterface {
    name = 'Init1778240154624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`imageFileName\` \`imageUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageUrl\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageUrl\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageUrl\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`imageUrl\` \`imageFileName\` varchar(255) NULL`);
    }

}
