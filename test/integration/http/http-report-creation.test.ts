import 'reflect-metadata';
import request from 'supertest';
import { ExpressAdapter } from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container'; // Main container
import ReportController from '@/infrastructure/controllers/report-controller';
import PlayerController from '@/infrastructure/controllers/player-controller';
import GameController from '@/infrastructure/controllers/game-controller'; // To setup games
import * as Constants from '@/shared/constants/constants';

// Repositories
import { IReportRepository } from '@/application/repositories/report-repository';
import { IPlayerRepository } from '@/application/repositories/player-repository';
import { IGameRepository } from '@/application/repositories/game-repository';
import { IUserRepository } from '@/application/repositories/user-repository';
import ReportRepositoryMemory from '@/infrastructure/repositories/report-repository-memory';
import PlayerRepositoryMemory from '@/infrastructure/repositories/player-repository-memory';
import GameRepositoryMemory from '@/infrastructure/repositories/game-repository-memory';
import UserRepositoryMemory from '@/infrastructure/repositories/user-repository-memory';

// Entities & Enums
import { Report } from '@/domain/entities/report';
import { Player } from '@/domain/entities/player';
import { Game, GameStatus } from '@/domain/entities/game';
import { User } from '@/domain/entities/user';
import { ReportMotivation } from '@/domain/enums/report-motivation';

// DTO
interface CreateReportDto {
  motivation: string; // Enum as string
  gameId: string;
  from: string; // Reporter's player ID
  to: string;   // Reported player's ID
  description?: string;
}

// --- Helper Functions ---
let userCounter = 0;
const createTestUser = async (userRepo: IUserRepository, suffix?: string): Promise<User> => {
  userCounter++;
  const id = `user${userCounter}${suffix || ''}`;
  const user = new User(`Test User ${id}`, `test-report-user-${id}@example.com`, 'password123', new Date(1990, 1, 1), `photo-${id}.jpg`);
  user.id = id;
  await userRepo.create(user);
  return user;
};

let playerCounter = 0;
const createTestPlayer = async (user: User, playerRepo: IPlayerRepository, suffix?: string): Promise<Player> => {
  playerCounter++;
  const name = `TestPlayer${playerCounter}${suffix || ''}`;
  // Player ID might be different from User ID in a real system.
  // For these tests, we'll often use user.id as player.id if CreatePlayer use case isn't called directly.
  // If CreatePlayer use case IS called, it will generate its own ID.
  // Let's assume for direct repo seeding, we can set it.
  const player = new Player(user.id, name, `Motto for ${name}`, 0, [], [], false, new Date(), new Date());
  player.id = `player${playerCounter}${suffix || ''}`; // Assign a distinct player ID
  await playerRepo.create(player);
  return player;
};

let gameCounter = 0;
const createTestGame = async (adminId: string, gameRepo: IGameRepository, status: GameStatus = GameStatus.SCHEDULED, players: Player[] = [], suffix?: string): Promise<Game> => {
  gameCounter++;
  const game = new Game(
    adminId,
    `fieldId${gameCounter}`,
    new Date(Date.now() + 24*60*60*1000), // tomorrow
    '15:00',
    2,
    10,
    10,
    status,
    `Test Game ${gameCounter}${suffix || ''} description`,
    'Standard rules apply',
    'TDM'
  );
  game.id = `game${gameCounter}${suffix || ''}`;
  players.forEach(p => game.addPlayer(p)); // Assumes addPlayer on entity works for seeding
  await gameRepo.create(game);
  if(players.length > 0) await gameRepo.update(game); // Persist playerList changes
  return game;
};


describe('ReportController - POST /reports (Create Report) E2E Tests', () => {
  let app: ExpressAdapter;
  let reportRepository: IReportRepository;
  let playerRepository: IPlayerRepository;
  let gameRepository: IGameRepository;
  let userRepository: IUserRepository;

  let reporterUser: User;
  let reportedUser: User;
  let reporterPlayer: Player;
  let reportedPlayer: Player;
  let finishedGame: Game;
  let adminUser: User; // For game creation

  beforeEach(async () => {
    const testContainer = container.createChildContainer();
    app = new ExpressAdapter();
    testContainer.register(Constants.HTTP, { useValue: app });

    userRepository = new UserRepositoryMemory();
    playerRepository = new PlayerRepositoryMemory();
    gameRepository = new GameRepositoryMemory();
    reportRepository = new ReportRepositoryMemory();

    testContainer.register(Constants.USER_REPOSITORY, { useValue: userRepository });
    testContainer.register(Constants.PLAYER_REPOSITORY, { useValue: playerRepository });
    testContainer.register(Constants.GAME_REPOSITORY, { useValue: gameRepository });
    testContainer.register(Constants.REPORT_REPOSITORY, { useValue: reportRepository });

    testContainer.resolve(ReportController);
    testContainer.resolve(PlayerController); // Needed if player creation is via API
    testContainer.resolve(GameController);   // Needed if game creation is via API

    // Setup prerequisite data
    adminUser = await createTestUser(userRepository, 'Admin');
    reporterUser = await createTestUser(userRepository, 'Reporter');
    reportedUser = await createTestUser(userRepository, 'Reported');

    reporterPlayer = await createTestPlayer(reporterUser, playerRepository, 'Reporter');
    reportedPlayer = await createTestPlayer(reportedUser, playerRepository, 'Reported');

    finishedGame = await createTestGame(adminUser.id, gameRepository, GameStatus.FINISHED, [reporterPlayer, reportedPlayer], 'ForReport');
  });

  const getValidReportDto = (): CreateReportDto => ({
    motivation: ReportMotivation.CHEATING.toString(), // Enum as string
    gameId: finishedGame.id,
    from: reporterPlayer.id,
    to: reportedPlayer.id,
    description: 'The player was flying.',
  });

  it('should create a new report successfully', async () => {
    const reportDto = getValidReportDto();
    const response = await request(app.getInstance())
      .post('/reports')
      .send(reportDto);

    expect(response.status).toBe(201);
    expect(response.body.report).toBeDefined();
    expect(response.body.report.from).toBe(reportDto.from);
    expect(response.body.report.to).toBe(reportDto.to);
    expect(response.body.report.gameId).toBe(reportDto.gameId);
    expect(response.body.report.motivation).toBe(reportDto.motivation);

    const dbReport = await reportRepository.findById(response.body.report.id);
    expect(dbReport).toBeDefined();
    expect(dbReport?.description).toBe(reportDto.description);
  });

  it('should return 400 for missing required fields (e.g., motivation)', async () => {
    const { motivation, ...incompleteDto } = getValidReportDto();
    const response = await request(app.getInstance())
      .post('/reports')
      .send(incompleteDto);
    expect(response.status).toBe(400); // Or 422
  });

  it('should return 404 if gameId is invalid (GAME_NOT_FOUND)', async () => {
    const reportDto = { ...getValidReportDto(), gameId: 'non-existent-game-id' };
    const response = await request(app.getInstance())
      .post('/reports')
      .send(reportDto);
    expect(response.status).toBe(404); // Assuming use case maps GameNotFound to 404
  });

  it('should return 404 if "from" player ID is invalid (PLAYER_NOT_FOUND)', async () => {
    const reportDto = { ...getValidReportDto(), from: 'non-existent-player-id' };
    const response = await request(app.getInstance())
      .post('/reports')
      .send(reportDto);
    expect(response.status).toBe(404); // Assuming use case maps PlayerNotFound to 404
  });

  it('should return 404 if "to" player ID is invalid (RECIPIENT_PLAYER_NOT_FOUND)', async () => {
    const reportDto = { ...getValidReportDto(), to: 'non-existent-player-id' };
    const response = await request(app.getInstance())
      .post('/reports')
      .send(reportDto);
    expect(response.status).toBe(404); // Assuming use case maps PlayerNotFound to 404
  });

  it('should return 400 if game is not finished (GAME_IS_NOT_FINISHED)', async () => {
    const scheduledGame = await createTestGame(adminUser.id, gameRepository, GameStatus.SCHEDULED, [reporterPlayer, reportedPlayer], 'Scheduled');
    const reportDto = { ...getValidReportDto(), gameId: scheduledGame.id };
    const response = await request(app.getInstance())
      .post('/reports')
      .send(reportDto);
    expect(response.status).toBe(400); // Or 403
  });

  it('should return 400 if reporter and reported are the same (SENDER_AND_RECIPIENT_ARE_THE_SAME)', async () => {
    const reportDto = { ...getValidReportDto(), to: reporterPlayer.id }; // Reporting self
    const response = await request(app.getInstance())
      .post('/reports')
      .send(reportDto);
    expect(response.status).toBe(400);
  });

  it('should return 400 if players did not play together in the specified game (DIDNT_PLAYED_TOGETHER)', async () => {
    const otherUser = await createTestUser(userRepository, 'Other');
    const otherPlayer = await createTestPlayer(otherUser, playerRepository, 'Other');
    // otherPlayer did not participate in finishedGame
    const reportDto = { ...getValidReportDto(), to: otherPlayer.id };
    const response = await request(app.getInstance())
      .post('/reports')
      .send(reportDto);
    expect(response.status).toBe(400);
  });

  it('should return 409 if report already exists for this game, reporter, and reported (REPORT_ALREADY_EXISTS)', async () => {
    const reportDto = getValidReportDto();
    // Create the report first
    await request(app.getInstance()).post('/reports').send(reportDto);

    // Attempt to create it again
    const response = await request(app.getInstance())
      .post('/reports')
      .send(reportDto);
    expect(response.status).toBe(409); // Conflict
  });
});
