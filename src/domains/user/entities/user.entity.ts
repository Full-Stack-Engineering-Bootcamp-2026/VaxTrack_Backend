import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VaccinationRecord } from "../../vaccination-record/entities/vaccinationRecord.enity";
import { Activity } from "../../activity/entities/activity.entity";
import { Dependent } from "../../dependant/entities/dependent.entity";

export enum UserRole {
    GUARDIAN = "GUARDIAN",
    STAFF = "STAFF",
    ADMIN = "ADMIN",
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

    @Column({ nullable: true })
    imageUrl: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.GUARDIAN,
    })
    role: UserRole;

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

    @Column({ nullable: true })
    resetToken: string;

    @Column({ type: 'datetime', nullable: true })
    resetTokenExpiry: Date;
}