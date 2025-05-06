import Report from "@/domain/entities/report";

export default interface ReportRepository {
  search(input: { gameId?: string; from?: string; to?: string; }): Promise<Report[]>;
  findByPlayerId(): Promise<Report | null>;
  create(report: Report): Promise<Report>;
};
