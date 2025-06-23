import {inject, injectable} from 'tsyringe';

import ReportMotivation from '@/domain/enums/report-motivation';

import ViewReceivedReportsHistory from '@/application/use-cases/report/view-received-reports-history';
import ViewGivenReportsHistory from '@/application/use-cases/report/view-given-reports-history';
import CreateReport from '@/application/use-cases/report/create-report';

import Http from '@/infrastructure/http';

import {
    VIEW_RECEIVED_REPORTS_HISTORY,
    VIEW_GIVEN_REPORTS_HISTORY,
    CREATE_REPORT,
    HTTP,
} from '@/shared/constants/constants';

@injectable()
export default class ReportController {
    private readonly PREFIX = '/report';

    constructor(
        @inject(VIEW_RECEIVED_REPORTS_HISTORY) private viewReceivedReportsHistory: ViewReceivedReportsHistory,
        @inject(VIEW_GIVEN_REPORTS_HISTORY) private viewGivenReportsHistory: ViewGivenReportsHistory,
        @inject(CREATE_REPORT) private createReport: CreateReport,
        @inject(HTTP) readonly http: Http,
    ) {

        http.on('get', `${this.PREFIX}/given/:playerId`, async function (params: {playerId: string}, body: any) {
            const playerId = params.playerId;
            const reports = await viewGivenReportsHistory.execute(playerId);
            return {reports};
        });

        http.on('get', `${this.PREFIX}/received/:playerId`, async function (params: {playerId: string}, body: any) {
            const playerId = params.playerId;
            const reports = await viewReceivedReportsHistory.execute(playerId);
            return {reports};
        });

        http.on('post', this.PREFIX, async function (params: any, body: CreateReportInputDto) {
            const report = await createReport.execute(body);
            return {report};
        });
    };

};

interface CreateReportInputDto {
    motivation: ReportMotivation;
    gameId: string;
    from: string;
    to: string;
}
