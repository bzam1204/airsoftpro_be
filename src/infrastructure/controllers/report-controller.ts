import {inject, injectable} from "tsyringe";

import Http from "@/infrastructure/http";
import CreateReport from "@/application/use-cases/report/create-report";
// ReportMotivation might be needed if any validation happens here, but DTO uses string
// import ReportMotivation from "@/domain/enums/report-motivation";

import {
  HTTP,
  CREATE_REPORT
} from "@/shared/constants/constants";

@injectable()
export default class ReportController {
  private readonly PREFIX = '/reports';

  constructor(
      @inject(CREATE_REPORT) readonly createReport: CreateReport,
      @inject(HTTP) readonly http: Http,
  ) {

    http.on('post', this.PREFIX, async function (params: any, body: CreateReportDto) {
      const report = await createReport.execute(body);
      return {report};
    });

  };

};

interface CreateReportDto {
  motivation: string; // ReportMotivation enum will be a string in DTO
  gameId: string;
  from: string;
  to: string;
  description?: string;
}
