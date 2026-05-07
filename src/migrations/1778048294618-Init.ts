import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778048294618 implements MigrationInterface {
    name = 'Init1778048294618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`resetToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`resetTokenExpiry\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP FOREIGN KEY \`FK_d2a3a33e1c3fcac3ccf10f1bc12\``);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP COLUMN \`vaccineId\``);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD \`vaccineId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vaccine\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`vaccine\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`vaccine\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD CONSTRAINT \`FK_d2a3a33e1c3fcac3ccf10f1bc12\` FOREIGN KEY (\`vaccineId\`) REFERENCES \`vaccine\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP FOREIGN KEY \`FK_d2a3a33e1c3fcac3ccf10f1bc12\``);
        await queryRunner.query(`ALTER TABLE \`vaccine\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`vaccine\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vaccine\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP COLUMN \`vaccineId\``);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD \`vaccineId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD CONSTRAINT \`FK_d2a3a33e1c3fcac3ccf10f1bc12\` FOREIGN KEY (\`vaccineId\`) REFERENCES \`vaccine\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`resetTokenExpiry\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`resetToken\``);
    }

}
