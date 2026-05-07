import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Vaccine } from "../../vaccine/entities/vaccine.entity";
import { Dependent } from "../../dependant/entities/dependent.entity";

export enum status {
    COMPLETED = "COMPLETED",
    UPCOMING = "UPCOMING",
    OVERDUE = "OVERDUE",
}
@Entity()
export class VaccinationRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => Dependent,
        (dependent) => dependent.vaccinationRecords,
        {
            onDelete: "CASCADE",
        }
    )
    dependent: Dependent;

    @ManyToOne(
        () => Vaccine,
        (vaccine) => vaccine.records
    )
    vaccine: Vaccine;

    @Column({ type: "date" })
    dueDate: Date;

    @Column({
        type: "date",
        nullable: true,
    })
    administeredDate: Date;

    @Column({ nullable: true })
    batchNumber: string;

    @Column({ nullable: true })
    clinicalNotes: string;

    @Column({
        type: "enum",
        enum: status,
        default: status.UPCOMING,
    })
    status: status;

    @ManyToOne(() => User, {
        nullable: true,
    })
    administeredBy: User;

    @CreateDateColumn()
    createdAt: Date;
}