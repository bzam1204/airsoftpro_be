import GameRepository from "@/domain/repositories/game-repository";
import PlayerRepository from "@/domain/repositories/player-repository";
import Game from "@/domain/entities/game";

export default class AddPlayerParticipation {

  constructor(
      private readonly gameRepository: GameRepository,
      private readonly playerRepository: PlayerRepository) {
  }

  async execute(gameId: string, playerId: string): Promise<Game> {
    const game = await this.gameRepository.findById(gameId);
    if (!game) throw new Error('GAME_NOT_FOUND');
    const player = await this.playerRepository.findById(playerId);
    if (!player) throw new Error("PLAYER_NOT_FOUND");
    const isPlayerAgendaOpened = await this.isPlayerAgendaOpened(playerId, game.startDate);
    if (!isPlayerAgendaOpened) {
      throw new Error('PARTICIPATION_IN_ANOTHER_GAME');
    }
    game.addPlayerParticipation(playerId);
    return game;
  };

  private async isPlayerAgendaOpened(playerId: string, gameStartDate: Date): Promise<boolean> {
    const games = await this.gameRepository.search({playerId, date : gameStartDate});
    return games.length === 0;
  };

};
