import ReportRepository from "@/domain/repositories/report-repository";
import Report from "@/domain/entities/report";

export default class ViewReceivedReportsHistory {

  constructor(private readonly reportRepository: ReportRepository) {
  }

  async execute(playerId: string): Promise<Report[]> {
    return await this.reportRepository.search({to : playerId});
  };

};