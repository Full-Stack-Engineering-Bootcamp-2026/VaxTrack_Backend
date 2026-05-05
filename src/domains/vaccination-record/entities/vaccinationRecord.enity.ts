import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Vaccine } from "../../vaccine/entities/vaccine.entity";
import { Dependent } from "../../dependant/entities/dependent.entity";

export enum Status {
    COMPLETED = "COMPLETED",
    UPCOMING = "UPCOMING",
    OVERDUE = "OVERDUE"
}
@Entity()
export class VaccinationRecord {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Dependent, (dep) => dep.vaccinationRecords, {
        onDelete: "CASCADE",
    })
    dependent: Dependent;

    @ManyToOne(() => Vaccine, (vaccine) => vaccine.records)
    vaccine: Vaccine;

    @ManyToOne(() => User)
    administeredBy: User;

    @Column({ type: "date", nullable: true })
    administeredDate: Date;

    @Column({ nullable: true })
    batchNumber: string;

    @Column({ nullable: true })
    clinicalNotes: string;

    @Column({
        type: "enum",
        enum: Status,
        default: "UPCOMING",
    })
    status: Status

    @Column({ type: "date" })
    dueDate: Date;

    @CreateDateColumn()
    createdAt: Date;
}