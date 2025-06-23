import 'reflect-metadata';

import AccountController from '@/infrastructure/controllers/account-controller';
import PlayerController from '@/infrastructure/controllers/player-controller';
import ReportController from '@/infrastructure/controllers/report-controller';
import FieldController from '@/infrastructure/controllers/field-controller';
import AuthController from '@/infrastructure/controllers/auth-controller';
import GameController from '@/infrastructure/controllers/game-controller';
import ExpressAdapter from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container';

import {HTTP} from '@/shared/constants/constants';
import globalErrorHandler from '@/infrastructure/middlewares/global-error-handler';

const app = new ExpressAdapter(container);
container.register(HTTP, {useValue: app});
app.registerControllers([AccountController, PlayerController, ReportController, FieldController, AuthController, GameController]);
app.useErrorMiddleware(globalErrorHandler);
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log('AIRSOFTPRO ---- Server Online ---- AIRSOFTPRO');
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/docs`);
});
