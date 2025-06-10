import 'reflect-metadata';
import request from 'supertest';
import { ExpressAdapter } from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container'; // Main container
import AuthController from '@/infrastructure/controllers/auth-controller';
import PlayerController from '@/infrastructure/controllers/player-controller';
import * as Constants from '@/shared/constants/constants';

// Repositories
import { IUserRepository } from '@/application/repositories/user-repository';
import { IPlayerRepository } from '@/application/repositories/player-repository';
import UserRepositoryMemory from '@/infrastructure/repositories/user-repository-memory';
import PlayerRepositoryMemory from '@/infrastructure/repositories/player-repository-memory';

// Services
import { IHashingService } from '@/application/services/hashing-service';
import { ITokenProvider } from '@/application/services/token-provider';
import HashingServiceBcryptjs from '@/infrastructure/services/hashing-service-bcryptjs';
import TokenProviderObject from '@/infrastructure/services/token-provider-object'; // Assuming this is the JWT provider

// Entities
import { User } from '@/domain/entities/user';
import { Player } from '@/domain/entities/player';

// DTOs (as defined in AuthController requirements)
interface CreateUserDto {
  name: string;
  photo: string;
  email: string;
  password: string;
  fullName: string;
  birth: string; // Date string
}

interface RegisterNewUserDto {
  playerName: string;
  password: string;
  fullName: string;
  birth: string; // Date string
  photo: string;
  email: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface ValidateTokenDto {
  token: string;
}

describe('AuthController - User Creation, Registration, and Token E2E Tests', () => {
  let app: ExpressAdapter;
  let userRepository: IUserRepository;
  let playerRepository: IPlayerRepository;
  let hashingService: IHashingService;
  let tokenProvider: ITokenProvider;

  beforeEach(async () => {
    const testContainer = container.createChildContainer();

    app = new ExpressAdapter();
    testContainer.register(Constants.HTTP, { useValue: app });

    userRepository = new UserRepositoryMemory();
    playerRepository = new PlayerRepositoryMemory();
    hashingService = new HashingServiceBcryptjs(); // Use real service
    tokenProvider = new TokenProviderObject('test-secret-key'); // Use real service with a test key

    testContainer.register(Constants.USER_REPOSITORY, { useValue: userRepository });
    testContainer.register(Constants.PLAYER_REPOSITORY, { useValue: playerRepository });
    testContainer.register(Constants.HASHING_SERVICE, { useValue: hashingService });
    testContainer.register(Constants.TOKEN_PROVIDER, { useValue: tokenProvider });

    // Resolve controllers
    testContainer.resolve(AuthController);
    testContainer.resolve(PlayerController); // Needed for /auth/register which creates a player
  });

  describe('POST /users (Create User)', () => {
    const validUserDto: CreateUserDto = {
      name: 'Test User',
      photo: 'test.jpg',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test Full Name',
      birth: '1990-01-01',
    };

    it('should create a new user successfully', async () => {
      const response = await request(app.getInstance())
        .post('/users')
        .send(validUserDto);

      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(validUserDto.email);
      expect(response.body.user.name).toBe(validUserDto.name);
      expect(response.body.user.password).toBeUndefined(); // Ensure password is not returned

      const dbUser = await userRepository.findByEmail(validUserDto.email);
      expect(dbUser).toBeDefined();
      expect(dbUser?.name).toBe(validUserDto.name);
    });

    it('should return 400 for missing required fields (e.g., email)', async () => {
      const { email, ...incompleteDto } = validUserDto;
      const response = await request(app.getInstance())
        .post('/users')
        .send(incompleteDto);
      expect(response.status).toBe(400); // Or 422
    });

    it('should return 400 for invalid email format', async () => {
      const dto = { ...validUserDto, email: 'invalid-email' };
      const response = await request(app.getInstance())
        .post('/users')
        .send(dto);
      expect(response.status).toBe(400); // Or 422
    });

    it('should return 400 for invalid birth date format', async () => {
      const dto = { ...validUserDto, birth: 'not-a-date' };
      const response = await request(app.getInstance())
        .post('/users')
        .send(dto);
      expect(response.status).toBe(400); // Or 422
    });

    it('should return 409 when email already exists', async () => {
      // Create user first
      await request(app.getInstance()).post('/users').send(validUserDto);

      // Attempt to create again
      const response = await request(app.getInstance())
        .post('/users')
        .send(validUserDto);
      expect(response.status).toBe(409); // Conflict
    });
  });

  // POST /auth/register tests will be added next
  describe('POST /auth/register (Register New User)', () => {
    const validRegisterDto: RegisterNewUserDto = {
      playerName: 'NewPlayer',
      password: 'password123',
      fullName: 'New Full Name',
      birth: '1995-05-05',
      photo: 'newplayer.jpg',
      email: 'newplayer@example.com',
    };

    it('should register a new user and player successfully', async () => {
      const response = await request(app.getInstance())
        .post('/auth/register')
        .send(validRegisterDto);

      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.player).toBeDefined();
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.user.email).toBe(validRegisterDto.email);
      expect(response.body.user.password).toBeUndefined();
      expect(response.body.player.name).toBe(validRegisterDto.playerName);

      const dbUser = await userRepository.findByEmail(validRegisterDto.email);
      expect(dbUser).toBeDefined();
      const dbPlayer = await playerRepository.findByUserId(dbUser!.id);
      expect(dbPlayer).toBeDefined();
      expect(dbPlayer?.name).toBe(validRegisterDto.playerName);
    });

    it('should return 400 for missing required fields', async () => {
      const { playerName, ...incompleteDto } = validRegisterDto;
      const response = await request(app.getInstance())
        .post('/auth/register')
        .send(incompleteDto);
      expect(response.status).toBe(400); // Or 422
    });

    it('should return 400 if player name is already taken', async () => {
      // First, register a user/player to take the name
      await request(app.getInstance()).post('/auth/register').send(validRegisterDto);

      // Try to register another user with the same player name but different email
      const anotherUserDto = {
        ...validRegisterDto,
        email: 'another@example.com',
        // Use a different user ID implicitly by not pre-creating user
      };
      const response = await request(app.getInstance())
        .post('/auth/register')
        .send(anotherUserDto);
      expect(response.status).toBe(400); // Or 409 for PLAYER_ALREADY_EXISTS
    });

    it('should return 409 if email already exists', async () => {
      // Create a user with the email first (e.g. via /users endpoint)
      await request(app.getInstance()).post('/users').send({
        name: 'Existing User',
        photo: 'existing.jpg',
        email: validRegisterDto.email, // Same email
        password: 'passwordSecure',
        fullName: 'Existing Full Name',
        birth: '1980-01-01',
      });

      const response = await request(app.getInstance())
        .post('/auth/register')
        .send(validRegisterDto); // Attempt to register with the same email
      expect(response.status).toBe(409); // Conflict due to email
    });

    it('should return 400 for invalid birth date format', async () => {
      const dto = { ...validRegisterDto, birth: 'invalid-date-string' };
      const response = await request(app.getInstance())
        .post('/auth/register')
        .send(dto);
      expect(response.status).toBe(400); // Or 422
    });
  });

  // POST /auth/login error tests will be added next
  describe('POST /auth/login (Error Cases)', () => {
    const loginUserEmail = 'loginerr@example.com';
    const loginUserPassword = 'password123';

    beforeEach(async () => {
      // Create a user for login tests
      const hashedPassword = await hashingService.hash(loginUserPassword);
      const user = new User('LoginErr User', loginUserEmail, hashedPassword, new Date('1990-01-01'), 'login.jpg');
      await userRepository.create(user);
    });

    it('should return 401 for non-existent email', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: loginUserPassword,
      };
      const response = await request(app.getInstance())
        .post('/auth/login')
        .send(loginDto);
      expect(response.status).toBe(401); // Or 400, "Invalid credentials"
    });

    it('should return 401 for incorrect password', async () => {
      const loginDto: LoginDto = {
        email: loginUserEmail,
        password: 'wrongPassword',
      };
      const response = await request(app.getInstance())
        .post('/auth/login')
        .send(loginDto);
      expect(response.status).toBe(401); // Or 400, "Invalid credentials"
    });
  });

  // POST /auth/validate-token tests will be added next
  describe('POST /auth/validate-token', () => {
    let validToken: string;

    beforeEach(async () => {
      // Create user and login to get a valid token
      const userEmail = 'validatetoken@example.com';
      const userPassword = 'password123';
      const hashedPassword = await hashingService.hash(userPassword);
      const user = new User('ValidateToken User', userEmail, hashedPassword, new Date('1990-01-01'), 'tokenuser.jpg');
      await userRepository.create(user);

      const loginResponse = await request(app.getInstance())
        .post('/auth/login')
        .send({ email: userEmail, password: userPassword });
      validToken = loginResponse.body.accessToken;
    });

    it('should return isValid:true for a valid token', async () => {
      const response = await request(app.getInstance())
        .post('/auth/validate-token')
        .send({ token: validToken } as ValidateTokenDto);

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
    });

    it('should return isValid:false for an invalid token', async () => {
      const response = await request(app.getInstance())
        .post('/auth/validate-token')
        .send({ token: 'invalid-token-string' } as ValidateTokenDto);

      expect(response.status).toBe(200); // As per use case, it returns boolean
      expect(response.body.isValid).toBe(false);
    });

    it('should return isValid:false for an expired token', async () => {
      // Generate an expired token directly using the provider
      const expiredToken = tokenProvider.generate('expiredUserId', '0s'); // Expires immediately

      const response = await request(app.getInstance())
        .post('/auth/validate-token')
        .send({ token: expiredToken } as ValidateTokenDto);

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(false);
    });
  });
});
