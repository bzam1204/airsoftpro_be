import Game from "@/domain/entities/game";
import GameRepository from "@/domain/repositories/game-repository";

import gameProps from "@test/shared/game-props";

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

  async update(game: Game): Promise<Game> {
    const index = this.gameList.findIndex(p => p.id === game.id);
    if (index === -1) throw new Error("GAME_NOT_FOUND");
    this.gameList[index] = game;
    return game;
  };

  async create(game: Game): Promise<Game> {
    this.gameList.push(game);
    return game;
  };

  private populate(games?: Game[]) {
    if (games) return games;
    return new Array(10).fill(null).map((_, i) => new Game({...gameProps, id : `${++i}`}));
  };

}
