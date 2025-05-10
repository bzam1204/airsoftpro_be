import {Payload} from "@/application/use-cases/refresh-token";

export default interface TokenProvider {

  signRefreshToken(payload: Payload): string;

  signAccessToken(payload: Payload): string;

  verifyAccessToken(token: string): boolean;

  verifyRefreshToken(token: string): boolean;

  decode(token: string): Payload;

};
