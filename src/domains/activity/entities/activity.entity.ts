import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

export enum ActivityAction {
    USER_REGISTERED = "USER_REGISTERED",

    USER_LOGGED_IN = "USER_LOGGED_IN",

    USER_LOGGED_OUT = "USER_LOGGED_OUT",

    PROFILE_UPDATED = "PROFILE_UPDATED",

    STAFF_CREATED = "STAFF_CREATED",

    DEPENDENT_CREATED = "DEPENDENT_CREATED",

    DEPENDENT_UPDATED = "DEPENDENT_UPDATED",

    DEPENDENT_DELETED = "DEPENDENT_DELETED",

    VACCINE_CREATED = "VACCINE_CREATED",

    VACCINE_UPDATED = "VACCINE_UPDATED",

    VACCINE_DISABLED = "VACCINE_DISABLED",

    VACCINATION_RECORDED = "VACCINATION_RECORDED",

    VACCINATION_UPDATED = "VACCINATION_UPDATED",

    OVERDUE_MARKED = "OVERDUE_MARKED",

    PASSWORD_RESET = "PASSWORD_RESET",
}


@Entity()
export class Activity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.activities, {
        onDelete: "CASCADE",
    })
    user: User;

    @Column({
        type: "enum",
        enum: ActivityAction,
    })
    action: ActivityAction;

    @Column("text", { nullable: true })
    description: string;

    @Column({ nullable: true })
    entityType: string;
    @Column({ nullable: true })
    entityId: string;

    @CreateDateColumn()
    createdAt: Date;
}