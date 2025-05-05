import Game from "@/domain/entities/game";
import GameRepository from "@/domain/repositories/game-repository";

import gameProps from "@test/shared/game-data";

export default class GameRepositoryMemory implements GameRepository {
  private readonly gameList: Game[];

  constructor(games?: Game[]) {
    this.gameList = this.populate(games);
  }

  async search(input: {playerId: string; date: Date;}): Promise<Game[]> {
    return this.gameList.filter(p => p.playerList.includes(input.playerId) && p.startDate === input.date);
  };

  async findById(gameId: string): Promise<Game | null> {
    return this.gameList.find(p => p.id === gameId) ?? null;
  };

  async findAll(): Promise<Game[]> {
    return this.gameList;
  };

  async update(data: Game): Promise<Game> {
    const index = this.gameList.findIndex(p => p.id === data.id);
    if (index === -1) throw new Error("GAME_NOT_FOUND");
    this.gameList[index] = data;
    return data;
  };

  private populate(games?: Game[]) {
    return games
        ? [...games]
        : new Array(10).fill(null).map((_, index) =>
            new Game({...gameProps, id : index.toString()})
        );
  };

  async create(game: Game): Promise<Game> {
    this.gameList.push(game);
    return game;
  };

}
