import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VaccinationRecord } from "../../vaccination-record/entities/vaccination-record.entity";

@Entity()
export class Vaccine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string;

    @Column("text")
    description: string;

    @Column()
    recommendedAgeInDays: number;

    @Column({ nullable: true })
    boosterSchedule: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => VaccinationRecord, (vr) => vr.vaccine)
    records: VaccinationRecord[];
}