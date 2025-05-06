import Report from "@/domain/entities/report";

export default interface ReportRepository {
  search(input: { gameId: string; from: string; to: string; }): Promise<Report[]>;
  create(report: Report): Promise<Report>;
};
