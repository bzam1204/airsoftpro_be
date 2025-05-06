import Player from "@/domain/entities/player";

export default interface PlayerRepository {
  findById(playerId: string): Promise<Player | null>;

  update(player: Player): Promise<Player>;

};
