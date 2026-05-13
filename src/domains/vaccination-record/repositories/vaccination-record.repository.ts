import { Service } from "typedi";
import { LessThan, Not, Repository } from "typeorm";
import { status, VaccinationRecord } from "../entities/vaccination-record.entity";
import { AppDataSource } from "../../../db/db";

@Service()
export class VaccinationRecordRepository {
    private repository: Repository<VaccinationRecord>;
    constructor() {
        this.repository = AppDataSource.getRepository(VaccinationRecord);
    }

    async findById(id: number): Promise<VaccinationRecord | null> {
        return this.repository.findOne({
            where: { id }, relations: {
                dependent: true,
                vaccine: true,
                administeredBy: true
            }
        });
    }

    async update(id: number, data: Partial<VaccinationRecord>): Promise<void> {
        await this.repository.update(id, data);
    }

    async findTimelineByDependent(dependentId: number, page: number, limit: number): Promise<[VaccinationRecord[], number]> {

        return this.repository.findAndCount({

            where: {
                dependent: {
                    id: dependentId,
                },
            },
            relations: {
                vaccine: true,
            },
            order: {
                dueDate: "ASC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOverDueVaccines(): Promise<VaccinationRecord[]> {
        return this.repository.find({ where: { dueDate: LessThan(new Date()), status: Not(status.COMPLETED) } });
    }

    async countCompleted(guardianId?: number): Promise<number> {
        if (guardianId) {  //guardian
            return this.repository.count({
                where: { status: status.COMPLETED, dependent: { guardian: { id: guardianId } } }, relations: {
                    dependent: {
                        guardian: true
                    }
                }
            });
        }
        return this.repository.count({ where: { status: status.COMPLETED } }); //admin and staff
    }

    async countUpcoming(guardianId?: number): Promise<number> {
        if (guardianId) {  //guardian
            return this.repository.count({
                where: { status: status.UPCOMING, dependent: { guardian: { id: guardianId } } }, relations: {
                    dependent: {
                        guardian: true
                    }
                }
            });
        }
        return this.repository.count({ where: { status: status.UPCOMING } }); //admin and staff
    }

    async countOverdue(guardianId?: number): Promise<number> {
        if (guardianId) {  //guardian
            return this.repository.count({
                where: { status: status.OVERDUE, dependent: { guardian: { id: guardianId } } }, relations: {
                    dependent: {
                        guardian: true
                    }
                }
            });
        }
        return this.repository.count({ where: { status: status.OVERDUE } }); //admin and staff
    }

    async findUpcomingVaccines(page: number, limit: number, guardianId?: number): Promise<[VaccinationRecord[], number]> {

        if (guardianId) {

            return this.repository.findAndCount({
                where: {
                    status: status.UPCOMING,
                    dependent: {
                        guardian: {
                            id: guardianId,
                        },
                    },
                },

                relations: {
                    vaccine: true,
                    dependent: true,
                },
                order: {
                    dueDate: "ASC",
                },
                skip: (page - 1) * limit,
                take: limit,
            });
        }

        return this.repository.findAndCount({
            where: {
                status: status.UPCOMING,
            },
            relations: {
                vaccine: true,
                dependent: true,
            },
            order: {
                dueDate: "ASC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOverdueVaccines(page: number, limit: number, guardianId?: number): Promise<[VaccinationRecord[], number]> {

        if (guardianId) {

            return this.repository.findAndCount({
                where: {
                    status: status.OVERDUE,
                    dependent: {
                        guardian: {
                            id: guardianId,
                        },
                    },
                },

                relations: {
                    vaccine: true,
                    dependent: true,
                },
                order: {
                    dueDate: "ASC",
                },
                skip: (page - 1) * limit,
                take: limit,
            });
        }

        return this.repository.findAndCount({
            where: {
                status: status.OVERDUE,
            },
            relations: {
                vaccine: true,
                dependent: true,
            },
            order: {
                dueDate: "ASC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async createMany(records: Partial<VaccinationRecord>[]): Promise<VaccinationRecord[]> {
        const vaccinationRecords = this.repository.create(records);

        return this.repository.save(vaccinationRecords);
    }
    async findAll(page: number, limit: number) {

        const [data, total,] = await this.repository.findAndCount({
            relations: {
                dependent: true,
                vaccine: true,
                administeredBy: true,
            },
            order: {
                dueDate: "ASC",
            },
            skip:
                (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPreviousPage: page > 1,
            },
        };
    }

    async save(record: VaccinationRecord) {

        return this.repository.save(
            record
        );
    }

    async delete(id: number) {
        return this.repository.delete(id);
    }

    async getChartTrend() {

        const records =
            await this.repository.find()

        const monthlyMap: Record<
            string,
            number
        > = {}

        records.forEach((record) => {

            const month = new Date(
                record.dueDate
            ).toLocaleString(
                "default",
                {
                    month: "short",
                }
            )

            monthlyMap[month] =
                (monthlyMap[month] || 0) + 1
        })

        const monthOrder = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]

        return monthOrder
            .filter(
                (month) =>
                    monthlyMap[month]
            )
            .map((month) => ({
                month,

                vaccinations:
                    monthlyMap[month],
            }))
    }
    async getWeeklyTrend() {
        const records = await this.repository.find()

        const weeklyMap: Record<string,
            {
                count: number
                timestamp: number
            }> = {}

        records.forEach((record) => {
            const date = new Date(record.dueDate)

            const startOfWeek = new Date(date)

            startOfWeek.setDate(date.getDate() - date.getDay())

            const label = startOfWeek.toLocaleDateString("default",
                {
                    month: "short",
                    day: "numeric",
                }
            )

            const timestamp = startOfWeek.getTime()

            if (!weeklyMap[label]) {
                weeklyMap[label] = {
                    count: 0,
                    timestamp,
                }
            }

            weeklyMap[label].count += 1
        })

        return Object.entries(
            weeklyMap
        )
            .sort((a, b) => a[1].timestamp - b[1].timestamp)
            .map(([week, value,]) => ({
                week,
                vaccinations: value.count,
            }))
    }

}