import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778131301856 implements MigrationInterface {
    name = 'Init1778131301856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vaccine\` CHANGE \`recommendedAge\` \`recommendedAgeInDays\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dependent\` ADD \`dateOfBirth\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dependent\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`resetToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`resetTokenExpiry\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP FOREIGN KEY \`FK_cc62670d1576e7f0daefb891e6c\``);
        await queryRunner.query(`ALTER TABLE \`dependent\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`dependent\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`dependent\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP COLUMN \`dependentId\``);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD \`dependentId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vaccine\` DROP COLUMN \`recommendedAgeInDays\``);
        await queryRunner.query(`ALTER TABLE \`vaccine\` ADD \`recommendedAgeInDays\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD CONSTRAINT \`FK_cc62670d1576e7f0daefb891e6c\` FOREIGN KEY (\`dependentId\`) REFERENCES \`dependent\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP FOREIGN KEY \`FK_cc62670d1576e7f0daefb891e6c\``);
        await queryRunner.query(`ALTER TABLE \`vaccine\` DROP COLUMN \`recommendedAgeInDays\``);
        await queryRunner.query(`ALTER TABLE \`vaccine\` ADD \`recommendedAgeInDays\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP COLUMN \`dependentId\``);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD \`dependentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`dependent\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`dependent\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dependent\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD CONSTRAINT \`FK_cc62670d1576e7f0daefb891e6c\` FOREIGN KEY (\`dependentId\`) REFERENCES \`dependent\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`resetTokenExpiry\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`resetToken\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageUrl\``);
        await queryRunner.query(`ALTER TABLE \`dependent\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`dependent\` DROP COLUMN \`dateOfBirth\``);
        await queryRunner.query(`ALTER TABLE \`vaccine\` CHANGE \`recommendedAgeInDays\` \`recommendedAge\` varchar(255) NOT NULL`);
    }

}
