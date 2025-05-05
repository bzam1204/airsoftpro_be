import GameRepository from "@/domain/repositories/game-repository";
import Game from "@/domain/entities/game";

export default class FinishGame {
  
  constructor(private readonly gameRepository: GameRepository) {
  }
  
  async execute(gameId: string): Promise<Game> {
    const game = await this.gameRepository.findById(gameId);
    if (!game) throw new Error("GAME_NOT_FOUND");
    game.finish();
    return game;
  }
}