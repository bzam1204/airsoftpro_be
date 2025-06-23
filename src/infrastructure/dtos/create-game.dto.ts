export interface CreateGameInputDto {
    specificRules?: string,
    minHonorLevel: number,
    playersLimit: number,
    description?: string,
    friendlyFire: boolean,
    startDate: Date,
    fpsLimit?: number,
    gameMode: string,
    fieldId: string,
}
