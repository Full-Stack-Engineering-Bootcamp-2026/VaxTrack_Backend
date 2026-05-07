import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

export enum ActivityAction {
    USER_REGISTERED = "USER_REGISTERED",

    DEPENDENT_CREATED = "DEPENDENT_CREATED",

    VACCINATION_RECORDED = "VACCINATION_RECORDED",

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