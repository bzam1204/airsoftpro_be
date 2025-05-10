import TokenProvider from "@/application/services/token-provider";

export default class ValidateToken {

  constructor(private readonly tokenProvider: TokenProvider) {
  }

  async execute(token: string): Promise<boolean> {
    const accessVerification = this.tokenProvider.verifyAccessToken(token);
    const refreshVerification = this.tokenProvider.verifyAccessToken(token);
    return accessVerification || refreshVerification;
  };

};
