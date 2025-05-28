import ReportMotivation from "@/domain/enums/report-motivation";
import GameStatus from "@/domain/enums/game-status";
import Report from "@/domain/entities/report";
import Player from "@/domain/entities/player";
import Game from "@/domain/entities/game";

import ReportRepositoryMemory from "@/infrastructure/repositories/report-repository-memory";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import reportProps from "@test/unit/report-props";
import playerProps from "@test/shared/player-props";
import gameProps from "@test/shared/game-props";
import IdGenerator from "@/application/services/id-generator";
import CreateReport from "@/application/use-cases/report/create-report";

describe('Criar Denúncia', function () {
  const reportRepository = () => new ReportRepositoryMemory();
  const playerRepository = () => new PlayerRepositoryMemory();
  const idGenerator = {generate : () => '1'} as IdGenerator;
  const defaultGame = () => new Game({...gameProps, playerList : ['1', '2'], status : GameStatus.FINISHED});

  it.each(Object.values(ReportMotivation))('Deve denunciar um jogador por cada motivo', async function (motivation) {
    const gameRepository = new GameRepositoryMemory([defaultGame()]);
    const createReport = new CreateReport(reportRepository(), playerRepository(), gameRepository, idGenerator);
    const report = await createReport.execute({motivation, gameId : '1', from : '2', to : '1'});
    expect(report).toBeDefined();
  });

  it('Não deve denunciar numa partida inexistente', async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const createReport = new CreateReport(reportRepository(), playerRepository(), gameRepository, idGenerator);
    const useCase = createReport.execute(reportProps);
    await expect(useCase).rejects.toThrow('GAME_NOT_FOUND');
  });

  it('Não deve denunciar um jogador inexistente', async function () {
    const gameRepository = new GameRepositoryMemory([defaultGame()]);
    const createReport = new CreateReport(reportRepository(), playerRepository(), gameRepository, idGenerator);
    const useCase = createReport.execute({...reportProps, to : 'invalid_id'});
    await expect(useCase).rejects.toThrow('RECIPIENT_PLAYER_NOT_FOUND');
  });

  it('Um jogador inexistente não deve denunciar', async function () {
    const gameRepository = new GameRepositoryMemory([defaultGame()]);
    const createReport = new CreateReport(reportRepository(), playerRepository(), gameRepository, idGenerator);
    const useCase = createReport.execute({...reportProps, from : "invalid_id"});
    await expect(useCase).rejects.toThrow('PLAYER_NOT_FOUND');
  });

  it('Não deve denunciar um jogador mais de uma vez por partida, independente do motivo', async function () {
    const reportRepository = new ReportRepositoryMemory([new Report({...reportProps, id : '1'})]);
    const gameRepository = new GameRepositoryMemory([defaultGame()]);
    const createReport = new CreateReport(reportRepository, playerRepository(), gameRepository, idGenerator);
    const useCase = createReport.execute({...reportProps});
    await expect(useCase).rejects.toThrow('REPORT_ALREADY_EXISTS');
  });

  it('Não deve denunciar jogadores que não jogaram juntos', async function () {
    const game = new Game({...gameProps, playerList : ['1', '3'], status : GameStatus.FINISHED});
    const gameRepository = new GameRepositoryMemory([game]);
    const createReport = new CreateReport(reportRepository(), playerRepository(), gameRepository, idGenerator);
    const useCase = createReport.execute({...reportProps});
    await expect(useCase).rejects.toThrow('DIDNT_PLAYED_TOGETHER');
  });

  it('Não deve denunciar em partidas que não estejam finalizadas', async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, playerList : ['1', '2']})]);
    const createReport = new CreateReport(reportRepository(), playerRepository(), gameRepository, idGenerator);
    const useCase = createReport.execute({...reportProps});
    await expect(useCase).rejects.toThrow('GAME_IS_NOT_FINISHED');
  });

  it('Deve diminuir um nível de honra se o nível de tolerância chegar a zero', async function () {
    const reportList = new Array(9).fill(null).map((_, i) => new Report({
      ...reportProps, id : `${++i}`, gameId : `${++i}`
    }));
    const gameList = new Array(10).fill(null).map((_, i) => (new Game({
      ...gameProps, status : GameStatus.FINISHED, playerList : ['1', '2'], id : `${++i}`
    })));
    const playerList = [new Player({...playerProps, tolerance : 1}), new Player({...playerProps, id : '2'})];
    const reportRepository = new ReportRepositoryMemory(reportList);
    const playerRepository = new PlayerRepositoryMemory(playerList);
    const gameRepository = new GameRepositoryMemory(gameList);
    const idGenerator = {generate : () => '11'} as IdGenerator;
    const createReport = new CreateReport(reportRepository, playerRepository, gameRepository, idGenerator);
    await createReport.execute({...reportProps});
    const recipientPlayer = await playerRepository.findById(reportProps.to);
    if (!recipientPlayer) throw new Error("PLAYER_NOT_FOUND");
    expect(recipientPlayer.honorLevel).toBe(5);
  });

});
