import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1777981397787 implements MigrationInterface {
    name = 'Init1777981397787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`activity\` (\`id\` varchar(36) NOT NULL, \`action\` varchar(255) NOT NULL, \`description\` text NULL, \`entityType\` varchar(255) NULL, \`entityId\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dependent\` (\`id\` varchar(36) NOT NULL, \`fullName\` varchar(255) NOT NULL, \`gender\` enum ('male', 'female') NOT NULL, \`relationship\` enum ('child', 'sibling', 'other') NOT NULL, \`notes\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`guardianId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fullName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`role\` enum ('GUARDIAN', 'STAFF', 'ADMIN') NOT NULL DEFAULT 'GUARDIAN', \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vaccination_record\` (\`id\` varchar(36) NOT NULL, \`administeredDate\` date NULL, \`batchNumber\` varchar(255) NULL, \`clinicalNotes\` varchar(255) NULL, \`status\` enum ('COMPLETED', 'UPCOMING', 'OVERDUE') NOT NULL DEFAULT 'UPCOMING', \`dueDate\` date NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dependentId\` varchar(36) NULL, \`vaccineId\` varchar(36) NULL, \`administeredById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vaccine\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`recommendedAge\` varchar(255) NOT NULL, \`boosterSchedule\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_3571467bcbe021f66e2bdce96ea\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_3571467bcbe021f66e2bdce96ea\``);
        await queryRunner.query(`DROP TABLE \`vaccine\``);
        await queryRunner.query(`DROP TABLE \`vaccination_record\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`dependent\``);
        await queryRunner.query(`DROP TABLE \`activity\``);
    }

}
