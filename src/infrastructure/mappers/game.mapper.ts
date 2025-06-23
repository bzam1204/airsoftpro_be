import Entity from '@/domain/entities/game';

export default class GameMapper {
    public static toDto(entity: Entity) {
        return {
            specificRules: entity.specificRules,
            minHonorLevel: entity.minHonorLevel,
            friendlyFire: entity.friendlyFire,
            playersLimit: entity.playersLimit,
            description: entity.description,
            finishDate: entity.finishDate,
            startDate: entity.startDate,
            gameMode: entity.gameMode,
            fpsLimit: entity.fpsLimit,
            fieldId: entity.fieldId,
            status: entity.status,
            id: entity.id,
        };
    };
};
