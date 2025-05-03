import Game, {GameStatus} from "@/domain/entities/game";
import GameRepository from "@/domain/repositories/game-repository";

export default class GameRepositoryMemory implements GameRepository {
  private readonly GAME_DATA = {
    id : "adsfa",
    status : GameStatus.SCHEDULED,
    fieldId : "123",
    fpsLimit : 400,
    gameMode : "MilSim",
    startDate : new Date(Date.now() + 1000 * 60 * 60 * 12),
    playerLimit : 10,
    description : undefined,
    friendlyFire : false,
    minHonorLevel : 0,
    specificRules : undefined,
  };
  private readonly gameList: Game[];

  constructor(games?: Game[]) {
    this.gameList = this.populate(games);
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
            new Game({...this.GAME_DATA, id : index.toString()})
        );
  };

  async create(game: Game): Promise<Game> {
    this.gameList.push(game);
    return game;
  };

}
