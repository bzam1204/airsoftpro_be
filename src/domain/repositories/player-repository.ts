import Player from "@/domain/entities/player";

export default interface PlayerRepository {

  findById(playerId: string): Promise<Player | null>;

}