import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VaccinationRecord } from "../../vaccination-record/entities/vaccinationRecord.enity";
import { Activity } from "../../activity/entities/activity.entity";
import { Dependent } from "../../dependant/entities/dependent.entity";

export enum UserRole {
    GUARDIAN = "guardian",
    STAFF = "staff",
    ADMIN = "admin"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

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