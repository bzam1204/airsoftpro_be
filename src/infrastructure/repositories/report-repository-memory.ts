import ReportRepository from '@/domain/repositories/report-repository';
import Report from '@/domain/entities/report';

export default class ReportRepositoryMemory implements ReportRepository {
    private readonly reports: Report[];

    constructor(reports?: Report[]) {
        this.reports = reports ?? [];
    }

    findByPlayerId(): Promise<Report | null> {
        throw new Error('Method not implemented.');
    };

    //todo: dominar essa function
    async search<K extends keyof Pick<Report, 'gameId' | 'from' | 'to'>>(
        filters: Partial<Pick<Report, 'gameId' | 'from' | 'to'>>
    ): Promise<Report[]> {
        return this.reports.filter(report =>
            (Object.entries(filters) as [K, Report[K]][])
                .every(([key, val]) => val == null || report[key] === val)
        );
    };

    async create(report: Report): Promise<Report> {
        this.reports.push(report);
        return report;
    };

};
