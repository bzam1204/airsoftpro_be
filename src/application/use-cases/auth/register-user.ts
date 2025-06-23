import User from '@/domain/entities/user';
import Player from '@/domain/entities/player';
import TokenProvider from '@/application/services/token-provider';
import CreatePlayer from '@/application/use-cases/player/create-player';
import VerifyPlayerName from '@/application/use-cases/player/verify-player-name';
import CreateUser from '@/application/use-cases/auth/create-user';
import {inject, injectable} from 'tsyringe';
import {CREATE_PLAYER, CREATE_USER, TOKEN_PROVIDER, VERIFY_PLAYER_NAME} from '@/shared/constants/constants';

@injectable()
export default class RegisterUser {

    constructor(
        @inject(VERIFY_PLAYER_NAME) private readonly verifyPlayerName: VerifyPlayerName,
        @inject(TOKEN_PROVIDER) private readonly tokenProvider: TokenProvider,
        @inject(CREATE_PLAYER) private readonly createPlayer: CreatePlayer,
        @inject(CREATE_USER) private readonly createUser: CreateUser,
    ) {
    };

    async execute({playerName, ...userProps}: Input): Promise<Output> {
        if (!await this.verifyPlayerName.execute(playerName)) throw new Error('PLAYER_ALREADY_EXISTS');
        const user = await this.createUser.execute(userProps);
        const player = await this.createPlayer.execute({userId: user.id, name: playerName});
        const payload = {sub: user.id, email: user.email, playerName: player.name, roles: ['PLAYER']};
        return {
            user,
            player,
            accessToken: this.tokenProvider.signAccessToken(payload),
            refreshToken: this.tokenProvider.signRefreshToken(payload),
        };
    };

};

interface Input {
    playerName: string;
    password: string;
    fullName: string;
    birth: Date;
    photo: string;
    email: string;
}

interface Output {
    user: User;
    player: Player;
    accessToken: string;
    refreshToken: string;
}