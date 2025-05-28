import GameRepository from "@/domain/repositories/game-repository";
import PlayerRepository from "@/domain/repositories/player-repository";
import Game from "@/domain/entities/game";

export default class RemovePlayerParticipation {

  constructor(
      private readonly gameRepository: GameRepository,
      private readonly playerRepository: PlayerRepository) {
  }

  async execute(gameId: string, playerId: string): Promise<Game> {
    const game = await this.gameRepository.findById(gameId);
    if (!game) throw new Error('GAME_NOT_FOUND');
    const player = await this.playerRepository.findById(playerId);
    if (!player) throw new Error("PLAYER_NOT_FOUND");
    game.removePlayer(playerId);
    return game;
  };

};