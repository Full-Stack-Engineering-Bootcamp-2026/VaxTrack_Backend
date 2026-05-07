import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VaccinationRecord } from "../../vaccination-record/entities/vaccination-record.entity";
import { User } from "../../user/entities/user.entity";

export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}
export enum Relationship {
    CHILD = "child",
    SIBLING = "sibling",
    OTHER = "other",
}

@Entity()
export class Dependent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({ type: "date" })
    dateOfBirth: Date;

    @Column({ type: 'enum', enum: Gender })
    gender: Gender;

    @Column({ type: 'enum', enum: Relationship })
    relationship: Relationship;

    @Column()
    notes: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.dependents, {
        onDelete: "CASCADE",
    })
    guardian: User;

    @OneToMany(() => VaccinationRecord, (vr) => vr.dependent)
    vaccinationRecords: VaccinationRecord[];

    @CreateDateColumn()
    createdAt: Date;
}