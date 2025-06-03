import Player from "@/domain/entities/player";
import PlayerRepository from "@/domain/repositories/player-repository";
import playerProps from "@test/shared/player-props";
import {injectable} from "tsyringe";

@injectable()
export default class PlayerRepositoryMemory implements PlayerRepository {
  private readonly players: Player[];

  constructor(players?: Player[]) {
    this.players = this.populate(players);
  }

  async findById(playerId: string): Promise<Player | null> {
    const player = this.players.find(p => p.id === playerId);
    return player ? player : null;
  };

  async findByName(name: string): Promise<Player | null> {
    const player = this.players.find(p => p.name === name);
    return player ? player : null;
  };
  
  async findByUserId(userId: string): Promise<Player | null> {
    const player = this.players.find(p => p.userId === userId);
    return player ? player : null;
  };

  async create(player: Player): Promise<Player> {
    this.players.push(player);
    return player;
  };

  async update(player: Player): Promise<Player> {
    const index = this.players.findIndex(p => p.id === player.id);
    if (index === -1) throw new Error('PLAYER_NOT_FOUND');
    this.players[index] = player;
    return player;
  };
  
  async count(): Promise<number> {
    return this.players.length;
  };

  private populate(players?: Player[]) {
    if (players) return players;
    return new Array(10).fill(null).map((_, i) => new Player({...playerProps, id : `${++i}`}));
  };

};
