import TokenProvider from "@/application/services/token-provider";

export default class ValidateToken {

  constructor(private readonly tokenProvider: TokenProvider) {
  }

  async execute(token: string): Promise<boolean> {
    return this.tokenProvider.validate(token);
  };

};
