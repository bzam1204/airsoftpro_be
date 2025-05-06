import ReportRepositoryMemory from "@/infrastructure/repositories/report-repository-memory";
import Report from "@/domain/entities/report";
import reportProps from "@test/unit/report-props";
import ViewReceivedReportsHistory from "@/application/use-cases/view-received-reports-history";

describe('Ver Histórico de Denúncias Recebidas', function () {
  
  it('Deve ver um histórico de denúncias recebidas', async function () {
    const reportsList = new Array(10).fill(null).map((_, i) => new Report({
      ...reportProps, id : `${++i}`, gameId : `${i}`
    }));
    const reportRepository = new ReportRepositoryMemory(reportsList);
    const viewReceivedReportsList = new ViewReceivedReportsHistory(reportRepository);
    const reports = await viewReceivedReportsList.execute('1');
    expect(reports.length).toBe(10);
  });
  
});
