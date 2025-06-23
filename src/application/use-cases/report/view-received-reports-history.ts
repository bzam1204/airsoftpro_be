import {inject, injectable} from 'tsyringe';

import ReportRepository from '@/domain/repositories/report-repository';
import Report from '@/domain/entities/report';

import {REPORT_REPOSITORY} from '@/shared/constants/constants';

@injectable()
export default class ViewReceivedReportsHistory {

    constructor(@inject(REPORT_REPOSITORY) private readonly reportRepository: ReportRepository) {
    }

    async execute(playerId: string): Promise<Report[]> {
        return await this.reportRepository.search({to: playerId});
    };

};
