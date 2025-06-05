import ReportRepository from "@/domain/repositories/report-repository";
import PlayerRepository from "@/domain/repositories/player-repository";
import GameRepository from "@/domain/repositories/game-repository";
import IdGenerator from "@/application/services/id-generator";
import ReportMotivation from "@/domain/enums/report-motivation";
import Report from "@/domain/entities/report";
import Game from "@/domain/entities/game";
import GameStatus from "@/domain/enums/game-status";
import {inject, injectable} from "tsyringe";
import {GAME_REPOSITORY, ID_GENERATOR, PLAYER_REPOSITORY, REPORT_REPOSITORY} from "@/shared/constants/constants";

@injectable()
export default class CreateReport {

  constructor(
      @inject(REPORT_REPOSITORY) private readonly reportRepository: ReportRepository,
      @inject(PLAYER_REPOSITORY) private readonly playerRepository: PlayerRepository,
      @inject(GAME_REPOSITORY) private readonly gameRepository: GameRepository,
      @inject(ID_GENERATOR) private readonly idGenerator: IdGenerator,
  ) {
  };

  async execute({motivation, gameId, from, to}: {
    motivation: ReportMotivation;
    gameId: string;
    from: string;
    to: string;
  }): Promise<Report> {
    const game = await this.gameRepository.findById(gameId);
    if (!game) throw new Error('GAME_NOT_FOUND');
    if (!this.isGameFinished(game)) throw new Error("GAME_IS_NOT_FINISHED");
    if (this.senderAndRecipientAreTheSame(from, to)) throw new Error('SENDER_AND_RECIPIENT_ARE_THE_SAME');
    const recipientPlayer = await this.playerRepository.findById(to);
    if (!recipientPlayer) throw new Error('RECIPIENT_PLAYER_NOT_FOUND');
    const senderPlayer = await this.playerRepository.findById(from);
    if (!senderPlayer) throw new Error("SENDER_PLAYER_NOT_FOUND");
    if (!this.didPlayTogether(game, from, to)) throw new Error("DIDNT_PLAYED_TOGETHER");
    if (!await this.isFirstReport(gameId, from, to)) throw new Error('REPORT_ALREADY_EXISTS');
    const report = new Report({motivation, gameId, from, to, id : this.idGenerator.generate()});
    await this.reportRepository.create(report);
    recipientPlayer.removeTolerance();
    await this.playerRepository.update(recipientPlayer);
    return report;
  };

  private isGameFinished(game: Game) {
    return game.status === GameStatus.FINISHED;
  };

  private didPlayTogether(game: Game, from: string, to: string) {
    return game.playerList.includes(from) && game.playerList.includes(to);
  };

  private async isFirstReport(gameId: string, from: string, to: string) {
    const reports = await this.reportRepository.search({gameId, from, to});
    return reports.length === 0;
  };
  
  private senderAndRecipientAreTheSame(senderId: string, recipientId: string) {
    return senderId === recipientId;
  };

};
