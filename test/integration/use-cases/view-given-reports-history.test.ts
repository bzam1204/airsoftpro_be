import Report from "@/domain/entities/report";

import ReportRepositoryMemory from "@/infrastructure/repositories/report-repository-memory";

import reportProps from "@test/unit/report-props";
import ViewGivenReportsHistory from "@/application/use-cases/report/view-given-reports-history";

describe('Ver Histórico de Denúncias Realizadas', function () {

  it('Deve visualizar todas as denúncias de um jogador', async function () {
    const reportsList = new Array(10).fill(null).map((_, i) => new Report({
      ...reportProps, id : `${++i}`, gameId : `${i}`
    }));
    const viewReportsHistory = new ViewGivenReportsHistory(new ReportRepositoryMemory(reportsList));
    const reports = await viewReportsHistory.execute('2');
    expect(reports.length).toBe(10);
  });

});
