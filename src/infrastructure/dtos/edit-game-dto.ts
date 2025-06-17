export interface EditGameInputDto {
    specificRules?: string;
    minHonorLevel?: number;
    playersLimit?: number;
    friendlyFire?: boolean;
    description?: string;
    startDate?: Date;
    fpsLimit?: number;
    gameMode?: string;
    fieldId?: string;
}

export interface EditGameOutputDto {
    game: {
        specificRules?: string;
        minHonorLevel: number;
        friendlyFire: boolean;
        playersLimit: number;
        description?: string;
        finishDate?: Date;
        startDate: Date;
        gameMode: string;
        fpsLimit: number;
        fieldId: string;
        status: string;
        id: string;
    };
}
