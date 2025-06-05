import {inject, injectable} from "tsyringe";

import CancelParticipation from "@/application/use-cases/game/cancel-participation";
import AddPlayerParticipation from "@/application/use-cases/game/add-player-participation";

import Http from "@/infrastructure/http";

import {
  ADD_PLAYER_PARTICIPATION, CREATE_PLAYER,
  HTTP,
  CANCEL_PARTICIPATION, CREATE_REPORT
} from "@/shared/constants/constants";
import CreatePlayer from "@/application/use-cases/player/create-player";
import CreateReport from "@/application/use-cases/report/create-report";
import ReportMotivation from "@/domain/enums/report-motivation";

@injectable()
export default class ReportController {
  private readonly PREFIX = '/report';

  constructor(
      @inject(CREATE_REPORT) readonly createReport: CreateReport,
      @inject(HTTP) readonly http: Http,
  ) {

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
