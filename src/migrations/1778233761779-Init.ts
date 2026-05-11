import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778233761779 implements MigrationInterface {
    name = 'Init1778233761779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` CHANGE \`action\` \`action\` enum ('USER_REGISTERED', 'USER_LOGGED_IN', 'USER_LOGGED_OUT', 'PROFILE_UPDATED', 'STAFF_CREATED', 'DEPENDENT_CREATED', 'DEPENDENT_UPDATED', 'DEPENDENT_DELETED', 'VACCINE_CREATED', 'VACCINE_UPDATED', 'VACCINE_DISABLED', 'VACCINATION_RECORDED', 'VACCINATION_UPDATED', 'OVERDUE_MARKED', 'PASSWORD_RESET') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` CHANGE \`action\` \`action\` enum ('USER_REGISTERED', 'DEPENDENT_CREATED', 'VACCINATION_RECORDED', 'PASSWORD_RESET') NOT NULL`);
    }

}
