import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778147812476 implements MigrationInterface {
    name = 'Init1778147812476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dependent\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fullName\` varchar(255) NOT NULL, \`dateOfBirth\` date NOT NULL, \`gender\` enum ('male', 'female') NOT NULL, \`relationship\` enum ('child', 'sibling', 'other') NOT NULL, \`notes\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`guardianId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vaccination_record\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dueDate\` date NOT NULL, \`administeredDate\` date NULL, \`batchNumber\` varchar(255) NULL, \`clinicalNotes\` varchar(255) NULL, \`status\` enum ('COMPLETED', 'UPCOMING', 'OVERDUE') NOT NULL DEFAULT 'UPCOMING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dependentId\` int NULL, \`vaccineId\` int NULL, \`administeredById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vaccine\` DROP COLUMN \`recommendedAgeInDays\``);
        await queryRunner.query(`ALTER TABLE \`vaccine\` ADD \`recommendedAgeInDays\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dependent\` ADD CONSTRAINT \`FK_13c7186997670addaea13374bd3\` FOREIGN KEY (\`guardianId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD CONSTRAINT \`FK_cc62670d1576e7f0daefb891e6c\` FOREIGN KEY (\`dependentId\`) REFERENCES \`dependent\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD CONSTRAINT \`FK_d2a3a33e1c3fcac3ccf10f1bc12\` FOREIGN KEY (\`vaccineId\`) REFERENCES \`vaccine\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` ADD CONSTRAINT \`FK_ce139293add17033f7bd146eca6\` FOREIGN KEY (\`administeredById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP FOREIGN KEY \`FK_ce139293add17033f7bd146eca6\``);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP FOREIGN KEY \`FK_d2a3a33e1c3fcac3ccf10f1bc12\``);
        await queryRunner.query(`ALTER TABLE \`vaccination_record\` DROP FOREIGN KEY \`FK_cc62670d1576e7f0daefb891e6c\``);
        await queryRunner.query(`ALTER TABLE \`dependent\` DROP FOREIGN KEY \`FK_13c7186997670addaea13374bd3\``);
        await queryRunner.query(`ALTER TABLE \`vaccine\` DROP COLUMN \`recommendedAgeInDays\``);
        await queryRunner.query(`ALTER TABLE \`vaccine\` ADD \`recommendedAgeInDays\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`vaccination_record\``);
        await queryRunner.query(`DROP TABLE \`dependent\``);
    }

}
