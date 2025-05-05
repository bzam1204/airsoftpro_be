import GameRepository from "@/domain/repositories/game-repository";

export default class CancelGame {

  constructor(private readonly gameRepository: GameRepository) {
  }

  async execute(gameId: string) {
    const game = await this.gameRepository.findById(gameId);
    if (!game) throw new Error('GAME_NOT_FOUND');
    game.cancel();
    return game;
  }
}