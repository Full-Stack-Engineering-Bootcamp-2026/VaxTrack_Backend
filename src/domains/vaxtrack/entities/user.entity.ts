import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    GUARDIAN = "guardian",
    STAFF = "staff",
    ADMIN = "admin"
}

@Entity("users")
@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({
        type: "enum",
        enum: ["GUARDIAN", "STAFF", "ADMIN"],
        default: "GUARDIAN",
    })
    role: "GUARDIAN" | "STAFF" | "ADMIN";

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Dependent, (dep) => dep.guardian)
    dependents: Dependent[];

    @OneToMany(() => VaccinationRecord, (vr) => vr.administeredBy)
    administeredVaccinations: VaccinationRecord[];

    @OneToMany(() => Activity, (activity) => activity.user)
    activities: Activity[];
}