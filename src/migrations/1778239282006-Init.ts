import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778239282006 implements MigrationInterface {
    name = 'Init1778239282006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`imageUrl\` \`imageFileName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageFileName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageFileName\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageFileName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageFileName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`imageFileName\` \`imageUrl\` varchar(255) NULL`);
    }

}
