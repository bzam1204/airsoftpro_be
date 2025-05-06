import ReportRepository from "@/domain/repositories/report-repository";
import Report from "@/domain/entities/report";

export default class ReportRepositoryMemory implements ReportRepository {
  private readonly reports: Report[];

  constructor(reports?: Report[]) {
    this.reports = reports ?? [];
  };

  async search({gameId, from, to}: {gameId: string; from: string; to: string;}): Promise<Report[]> {
    return this.reports.filter(p => p.gameId === gameId && p.from === from && p.to && to);
  };

  async create(report: Report): Promise<Report> {
    this.reports.push(report);
    return report;
  };

};
