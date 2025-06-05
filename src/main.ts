import 'reflect-metadata';

import AccountController from "@/infrastructure/controllers/account-controller";
import PlayerController from "@/infrastructure/controllers/player-controller";
import AuthController from "@/infrastructure/controllers/auth-controller";
import GameController from "@/infrastructure/controllers/game-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {HTTP} from "@/shared/constants/constants";
import ReportController from "@/infrastructure/controllers/report-controller";

const app = new ExpressAdapter();

container.register(HTTP, {useValue : app});
container.resolve(AccountController);
container.resolve(PlayerController);
container.resolve(ReportController);
container.resolve(AuthController);
container.resolve(GameController);

app.listen(3000, () => console.log('AIRSOFTPRO ---- Server Online ---- AIRSOFTPRO'));
