import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Activity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.activities, {
        onDelete: "CASCADE",
    })
    user: User;

    @Column()
    action: string;

    @Column("text", { nullable: true })
    description: string;

    @Column({ nullable: true })
    entityType: string;
    @Column({ nullable: true })
    entityId: string;

    @CreateDateColumn()
    createdAt: Date;
}