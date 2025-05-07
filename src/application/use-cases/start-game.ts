import GameRepository from "@/domain/repositories/game-repository";

export default class StartGame {
  
  constructor(private readonly gameRepository: GameRepository){
  }
  
  async execute(gameId: string) {
    const game = await this.gameRepository.findById(gameId);
    if (!game) throw new Error("GAME_NOT_FOUND");
    game.start();
    return await this.gameRepository.update(game);
  };
  
};
