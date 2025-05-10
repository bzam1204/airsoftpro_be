import TokenProvider from "@/application/services/token-provider";

import {Payload} from "@/application/use-cases/refresh-token";

export default class TokenProviderObject implements TokenProvider {
  private readonly refreshSecret = '321';
  private readonly accessSecret = '123';

  signRefreshToken(payload: Payload): string {
    return JSON.stringify({...payload, code : this.refreshSecret});
  };

  signAccessToken(payload: Payload): string {
    return JSON.stringify({...payload, code : this.accessSecret});
  };

  verifyAccessToken(token: string): boolean {
    const {code} = this.decode(token);
    return this.accessSecret === code;
  };

  verifyRefreshToken(token: string): boolean {
    const {code} = this.decode(token);
    return this.refreshSecret === code;
  };

  decode(token: string): Payload & {code: string} {
    return JSON.parse(token);
  };

};
