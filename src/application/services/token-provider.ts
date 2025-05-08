export default interface TokenProvider {
  signAccessToken(payload: object): string;

  signRefreshToken(payload: object): string;

  validate(token: string): boolean;
};
