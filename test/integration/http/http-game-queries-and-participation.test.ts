import 'reflect-metadata';
import request from 'supertest';
import { ExpressAdapter } from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container';
import GameController from '@/infrastructure/controllers/game-controller';
import PlayerController from '@/infrastructure/controllers/player-controller'; // Needed for player creation/setup
import * as Constants from '@/shared/constants/constants';
import GameRepositoryMemory from '@/infrastructure/repositories/game-repository-memory';
import PlayerRepositoryMemory from '@/infrastructure/repositories/player-repository-memory';
import { Game, GameStatus } from '@/domain/entities/game';
import { Player } from '@/domain/entities/player';
import { IGameRepository } from '@/application/repositories/game-repository';
import { IPlayerRepository } from '@/application/repositories/player-repository';
import { CreateGameInputDto } from '@/application/use-cases/game/create-game'; // For game creation
import { CreatePlayerInputDto } from '@/application/use-cases/player/create-player'; // For player creation

// Helper function to create a basic game for testing
const createTestGame = (props: Partial<CreateGameInputDto> = {}): CreateGameInputDto => ({
  fieldId: props.fieldId || 'field-123',
  gameMode: props.gameMode || 'Team Deathmatch',
  gameDate: props.gameDate || new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  gameTime: props.gameTime || '14:00',
  maxPlayers: props.maxPlayers || 10,
  minPlayers: props.minPlayers || 2,
  price: props.price === undefined ? 10 : props.price,
  adminId: props.adminId || 'admin-user-123',
  description: props.description,
  rules: props.rules,
  status: props.status || GameStatus.SCHEDULED,
});

// Helper function to create a basic player for testing
const createTestPlayer = (props: Partial<CreatePlayerInputDto> = {}): CreatePlayerInputDto => ({
  userId: props.userId || `user-${Math.random().toString(36).substring(7)}`,
  name: props.name || `Player ${Math.random().toString(36).substring(7)}`,
  motto: props.motto || 'Test motto',
});


describe('GameController - Queries and Participation E2E Tests', () => {
  let app: ExpressAdapter;
  let gameRepository: IGameRepository;
  let playerRepository: IPlayerRepository;

  beforeEach(async () => {
    // Create a new container instance for each test to ensure isolation
    const testContainer = container.createChildContainer();

    app = new ExpressAdapter();
    testContainer.register(Constants.HTTP, { useValue: app });

    // Use fresh repositories for each test
    gameRepository = new GameRepositoryMemory();
    playerRepository = new PlayerRepositoryMemory();
    testContainer.register(Constants.GAME_REPOSITORY, { useValue: gameRepository });
    testContainer.register(Constants.PLAYER_REPOSITORY, { useValue: playerRepository });

    // Resolve controllers
    testContainer.resolve(GameController);
    testContainer.resolve(PlayerController); // Player controller might be needed if player creation is part of setup

    // Clear data from repositories (though new instances should be empty)
    await gameRepository.deleteAll?.(); // Assuming a deleteAll method for memory repo
    await playerRepository.deleteAll?.();
  });

  describe('GET /games', () => {
    it('should return an empty array when no games exist', async () => {
      const response = await request(app.getInstance()).get('/games');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return an array of games when games exist', async () => {
      const game1Data = createTestGame({ fieldId: 'field1', gameMode: 'ModeA' });
      const game2Data = createTestGame({ fieldId: 'field2', gameMode: 'ModeB' });
      // Directly add to repo for testing GET, assuming CreateGame use case is tested elsewhere
      const game1 = new Game(game1Data.adminId, game1Data.fieldId, game1Data.gameDate, game1Data.gameTime, game1Data.minPlayers, game1Data.maxPlayers, game1Data.price, GameStatus.SCHEDULED, game1Data.description, game1Data.rules, game1Data.gameMode);
      const game2 = new Game(game2Data.adminId, game2Data.fieldId, game2Data.gameDate, game2Data.gameTime, game2Data.minPlayers, game2Data.maxPlayers, game2Data.price, GameStatus.SCHEDULED, game2Data.description, game2Data.rules, game2Data.gameMode);
      await gameRepository.create(game1);
      await gameRepository.create(game2);

      const response = await request(app.getInstance()).get('/games');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      // Add more specific checks if needed, e.g., checking game IDs or properties
      expect(response.body.some((g: Game) => g.id === game1.id)).toBeTruthy();
      expect(response.body.some((g: Game) => g.id === game2.id)).toBeTruthy();
    });
  });

  describe('GET /game/:gameId', () => {
    it('should return a game when a valid gameId is provided', async () => {
      const gameData = createTestGame({});
      const game = new Game(gameData.adminId, gameData.fieldId, gameData.gameDate, gameData.gameTime, gameData.minPlayers, gameData.maxPlayers, gameData.price, GameStatus.SCHEDULED, gameData.description, gameData.rules, gameData.gameMode);
      await gameRepository.create(game);

      const response = await request(app.getInstance()).get(`/game/${game.id}`);
      expect(response.status).toBe(200);
      expect(response.body.game).toBeDefined();
      expect(response.body.game.id).toBe(game.id);
      expect(response.body.game.gameMode).toBe(game.gameMode);
    });

    it('should return 404 when an invalid gameId is provided', async () => {
      const response = await request(app.getInstance()).get('/game/non-existent-id');
      // Assuming the API returns 404 for game not found.
      // The controller might throw an error that gets mapped to 500 if not handled for 404.
      // This depends on global error handling setup. For robust tests, this should be known.
      // Let's assume a generic 404 or 500 if specific error mapping isn't in place.
      // Based on typical behavior of ViewGame use case, it would throw GameNotFoundError.
      // If this error is mapped to 404 by an error handler middleware, this test is fine.
      // Otherwise, it might be 500. Let's expect 404 for now.
      expect(response.status).toBe(404);
    });
  });

  // More describe blocks for POST and DELETE participation will be added next.

  describe('POST /game/:gameId/participation', () => {
    let testPlayer: Player;
    let testGame: Game;

    beforeEach(async () => {
      // Create a player
      const playerData = createTestPlayer({});
      testPlayer = new Player(playerData.userId, playerData.name, playerData.motto, 0, [], [], false, new Date(), new Date());
      testPlayer.id = playerData.userId; // Assuming userId can be player id for simplicity here
      await playerRepository.create(testPlayer);

      // Create a game
      const gameData = createTestGame({ maxPlayers: 5 });
      testGame = new Game(gameData.adminId, gameData.fieldId, gameData.gameDate, gameData.gameTime, gameData.minPlayers, gameData.maxPlayers, gameData.price, GameStatus.SCHEDULED, gameData.description, gameData.rules, gameData.gameMode);
      await gameRepository.create(testGame);
    });

    it('should allow a player to join a game and return the updated game', async () => {
      const response = await request(app.getInstance())
        .post(`/game/${testGame.id}/participation`)
        .send({ playerId: testPlayer.id } as AddPlayerParticipationDto);

      expect(response.status).toBe(200); // Or 201 if that's the API standard
      expect(response.body.game).toBeDefined();
      expect(response.body.game.id).toBe(testGame.id);
      expect(response.body.game.playerList).toBeInstanceOf(Array);
      expect(response.body.game.playerList).toContain(testPlayer.id);

      const updatedGame = await gameRepository.findById(testGame.id);
      expect(updatedGame?.playerList.some(p => p.id === testPlayer.id)).toBeTruthy();
    });

    it('should return 404 if gameId is invalid', async () => {
      const response = await request(app.getInstance())
        .post(`/game/invalid-game-id/participation`)
        .send({ playerId: testPlayer.id } as AddPlayerParticipationDto);
      expect(response.status).toBe(404); // Assuming GameNotFound leads to 404
    });

    it('should return 404 if playerId is invalid', async () => {
       // This depends on AddPlayerParticipation use case correctly handling PlayerNotFound
      const response = await request(app.getInstance())
        .post(`/game/${testGame.id}/participation`)
        .send({ playerId: 'invalid-player-id' } as AddPlayerParticipationDto);
      expect(response.status).toBe(404); // Assuming PlayerNotFound leads to 404
    });

    it('should return an error if the game is full', async () => {
      // Create a game with maxPlayers = 1
      const fullGameData = createTestGame({ maxPlayers: 1 });
      const fullGame = new Game(fullGameData.adminId, fullGameData.fieldId, fullGameData.gameDate, fullGameData.gameTime, fullGameData.minPlayers, fullGameData.maxPlayers, fullGameData.price, GameStatus.SCHEDULED);
      await gameRepository.create(fullGame);

      // Add one player to fill the game
      const player1Data = createTestPlayer({ userId: 'p1'});
      const player1 = new Player(player1Data.userId, player1Data.name, player1Data.motto);
      player1.id = player1Data.userId;
      await playerRepository.create(player1);
      fullGame.addPlayer(player1); // Manually add to game state for test
      await gameRepository.update(fullGame);


      const player2Data = createTestPlayer({ userId: 'p2'});
      const player2 = new Player(player2Data.userId, player2Data.name, player2Data.motto);
      player2.id = player2Data.userId;
      await playerRepository.create(player2);

      const response = await request(app.getInstance())
        .post(`/game/${fullGame.id}/participation`)
        .send({ playerId: player2.id } as AddPlayerParticipationDto);
      // This status code depends on how GameFullError is handled.
      // It could be 400, 403, or 409. Let's assume 400 for a bad request due to business rule.
      expect(response.status).toBe(400);
    });

    it('should return an error if player is already in the game', async () => {
      // Add player to game first
      testGame.addPlayer(testPlayer);
      await gameRepository.update(testGame);

      const response = await request(app.getInstance())
        .post(`/game/${testGame.id}/participation`)
        .send({ playerId: testPlayer.id } as AddPlayerParticipationDto);
      // This status code depends on how PlayerAlreadyInGameError (or similar) is handled.
      // Assuming 400 or 409 (Conflict). Let's use 400.
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /game/:gameId/participation/:playerId', () => {
    let testPlayer: Player;
    let testGame: Game;

    beforeEach(async () => {
      const playerData = createTestPlayer({});
      testPlayer = new Player(playerData.userId, playerData.name, playerData.motto, 0, [], [], false, new Date(), new Date());
      testPlayer.id = playerData.userId;
      await playerRepository.create(testPlayer);

      const gameData = createTestGame({});
      testGame = new Game(gameData.adminId, gameData.fieldId, gameData.gameDate, gameData.gameTime, gameData.minPlayers, gameData.maxPlayers, gameData.price, GameStatus.SCHEDULED, gameData.description, gameData.rules, gameData.gameMode);
      testGame.addPlayer(testPlayer); // Player is part of the game
      await gameRepository.create(testGame);
      await gameRepository.update(testGame); // Ensure playerList is saved
    });

    it('should allow a player to cancel participation and return the updated game', async () => {
      const response = await request(app.getInstance())
        .delete(`/game/${testGame.id}/participation/${testPlayer.id}`);

      expect(response.status).toBe(200);
      expect(response.body.game).toBeDefined();
      expect(response.body.game.id).toBe(testGame.id);
      expect(response.body.game.playerList).toBeInstanceOf(Array);
      expect(response.body.game.playerList.find((p: any) => p.id === testPlayer.id)).toBeUndefined();

      const updatedGame = await gameRepository.findById(testGame.id);
      expect(updatedGame?.playerList.some(p => p.id === testPlayer.id)).toBeFalsy();
    });

    it('should return 404 if gameId is invalid', async () => {
      const response = await request(app.getInstance())
        .delete(`/game/invalid-game-id/participation/${testPlayer.id}`);
      expect(response.status).toBe(404);
    });

    it('should return 404 if playerId is invalid', async () => {
      const response = await request(app.getInstance())
        .delete(`/game/${testGame.id}/participation/invalid-player-id`);
      expect(response.status).toBe(404); // Assuming PlayerNotFound from use case
    });

    it('should return an error if player is not in the specified game', async () => {
      const otherPlayerData = createTestPlayer({ userId: 'otherP' });
      const otherPlayer = new Player(otherPlayerData.userId, otherPlayerData.name, otherPlayerData.motto);
      otherPlayer.id = otherPlayerData.userId;
      await playerRepository.create(otherPlayer);

      const response = await request(app.getInstance())
        .delete(`/game/${testGame.id}/participation/${otherPlayer.id}`);
      // This status code depends on how PlayerNotInGameError is handled. Assuming 400.
      expect(response.status).toBe(400);
    });

    it('should return an error if game is not in cancellable state (e.g. STARTED)', async () => {
      testGame.status = GameStatus.STARTED; // Change game state
      await gameRepository.update(testGame);

      const response = await request(app.getInstance())
        .delete(`/game/${testGame.id}/participation/${testPlayer.id}`);
      // This status code depends on how GameNotInScheduledStatusError (or similar) is handled. Assuming 400.
      expect(response.status).toBe(400);
    });
  });
});

// DTO for POST /game/:gameId/participation
interface AddPlayerParticipationDto {
  playerId: string;
}
