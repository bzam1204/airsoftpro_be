import request from 'supertest';
import express from "express";

import {Payload} from "@/application/use-cases/refresh-token";
import Login from "@/application/use-cases/login";

import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import HashingServiceBcryptjs from "@/infrastructure/services/hashing-service-bcryptjs";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";

import User from "@/domain/entities/user";

import userProps from "@test/shared/user-props";

describe('Entrar no sistema por HTTP', function () {
  let app: any;

  beforeAll(function () {
    app = express();
    app.use(express.json());
    app.post('/login', async (req: any, res: any) => {
      const {email, password} = req.body;
      const fieldAdminRepository = new FieldAdminRepositoryMemory();
      const playerRepository = new PlayerRepositoryMemory();
      const hashingService = new HashingServiceBcryptjs();
      const userRepository = new UserRepositoryMemory([new User({
        ...userProps, id : '1', password : await hashingService.hash('123123', 10), email : 'user@example.com'
      })]);
      const tokenProviderStub = {
        signRefreshToken : () => '321321',
        signAccessToken : () => '123123',
        validate : () => true,
        decode : () => ({} as Payload),
      };
      const login = new Login(fieldAdminRepository, playerRepository, userRepository, hashingService, tokenProviderStub);
      const {accessToken, refreshToken} = await login.execute({email, password});
      res.send({accessToken, refreshToken});
    });
  });

  it('Deve entrar no sistema', async function () {
    const credentials = {email : 'user@example.com', password : '123123'};
    await request(app)
        .post('/login')
        .send(credentials)
        .expect(200)
        .expect(res => {
          expect(res.body.accessToken).toBe('123123')
          expect(res.body.refreshToken).toBe('321321')
        });
  });

});
