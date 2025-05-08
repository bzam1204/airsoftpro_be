import {Payload} from "@/application/use-cases/refresh-token";

export default interface TokenProvider {

  signRefreshToken(payload: object): string;

  signAccessToken(payload: object): string;

  validate(token: string): boolean;

  decode(token: string): Payload;
  
};
