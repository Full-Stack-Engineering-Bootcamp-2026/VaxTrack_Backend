import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778398877905 implements MigrationInterface {
    name = 'Init1778398877905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` CHANGE \`action\` \`action\` enum ('USER_REGISTERED', 'USER_LOGGED_IN', 'USER_LOGGED_OUT', 'PROFILE_UPDATED', 'STAFF_CREATED', 'STAFF_DELETED', 'DEPENDENT_CREATED', 'DEPENDENT_UPDATED', 'DEPENDENT_DELETED', 'VACCINE_CREATED', 'VACCINE_UPDATED', 'VACCINE_DISABLED', 'VACCINATION_RECORDED', 'VACCINATION_UPDATED', 'OVERDUE_MARKED', 'PASSWORD_RESET') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` CHANGE \`action\` \`action\` enum ('USER_REGISTERED', 'USER_LOGGED_IN', 'USER_LOGGED_OUT', 'PROFILE_UPDATED', 'STAFF_CREATED', 'DEPENDENT_CREATED', 'DEPENDENT_UPDATED', 'DEPENDENT_DELETED', 'VACCINE_CREATED', 'VACCINE_UPDATED', 'VACCINE_DISABLED', 'VACCINATION_RECORDED', 'VACCINATION_UPDATED', 'OVERDUE_MARKED', 'PASSWORD_RESET') NOT NULL`);
    }

}
