import {inject, injectable} from 'tsyringe';

import TokenProvider from '@/application/services/token-provider';

import {TOKEN_PROVIDER} from '@/shared/constants/constants';

@injectable()
export default class ValidateToken {

    constructor(@inject(TOKEN_PROVIDER) private readonly tokenProvider: TokenProvider) {
    }

    async execute(token: string): Promise<boolean> {
        const accessVerification = this.tokenProvider.verifyAccessToken(token);
        const refreshVerification = this.tokenProvider.verifyRefreshToken(token);
        return accessVerification || refreshVerification;
    };

};
