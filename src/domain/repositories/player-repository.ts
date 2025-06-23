import Player from '@/domain/entities/player';

export default interface PlayerRepository {
    findById(playerId: string): Promise<Player | null>;

    findByName(name: string): Promise<Player | null>;

    findByUserId(userId: string): Promise<Player | null>;

    create(player: Player): Promise<Player>;

    update(player: Player): Promise<Player>;

    count(): Promise<number>;

};
