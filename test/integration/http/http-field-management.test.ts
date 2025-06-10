import 'reflect-metadata';
import request from 'supertest';
import { ExpressAdapter } from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container';
import FieldController from '@/infrastructure/controllers/field-controller';
import UserController from '@/infrastructure/controllers/user-controller'; // For creating users
import AuthController from '@/infrastructure/controllers/auth-controller'; // For creating users that can be admins
import * as Constants from '@/shared/constants/constants';

// Repositories
import { IFieldRepository } from '@/application/repositories/field-repository';
import { IUserRepository } from '@/application/repositories/user-repository';
import { IAdminRepository } from '@/application/repositories/admin-repository';
import { IFieldAdminRepository } from '@/application/repositories/field-admin-repository';
import FieldRepositoryMemory from '@/infrastructure/repositories/field-repository-memory';
import UserRepositoryMemory from '@/infrastructure/repositories/user-repository-memory';
import AdminRepositoryMemory from '@/infrastructure/repositories/admin-repository-memory';
import FieldAdminRepositoryMemory from '@/infrastructure/repositories/field-admin-repository-memory';

// Entities
import { Field } from '@/domain/entities/field';
import { User } from '@/domain/entities/user';
import { Admin } from '@/domain/entities/admin';
import { FieldAdmin } from '@/domain/entities/field-admin';

// DTOs (will be defined more specifically within tests or imported if available)
interface RegisterFieldDto {
  name: string;
  address: string;
  description: string;
  photos: string[];
  rules: string;
  adminId: string;
  infrastructure: string; // Assuming this is a simple string for now
  // coordinates might be { latitude: number, longitude: number } or string
}

interface EditFieldDto {
  name?: string;
  address?: string;
  description?: string;
  photos?: string[];
  rules?: string;
  infrastructure?: string;
}

interface CreateFieldAdminDto {
  userId: string;
}

// --- Helper Functions ---
const createTestUser = (id: string, emailSuffix: string = ''): User => {
  const user = new User(`Test User ${id}`, `test${id}${emailSuffix}@example.com`, 'password123', new Date(1990, 1, 1), `photo${id}.jpg`);
  user.id = id;
  return user;
};

const createTestAdmin = async (user: User, adminRepo: IAdminRepository): Promise<Admin> => {
  const admin = new Admin(user.id);
  admin.id = user.id; // Often admin ID is same as user ID
  await adminRepo.create(admin);
  return admin;
};

const createTestField = (id: string, adminId: string): Field => {
  const field = new Field(
    `Field ${id}`,
    adminId,
    'Test Address',
    'Test Description',
    ['photo1.jpg'],
    'Test Rules',
    {latitude: 0, longitude: 0}, // Assuming Coordinates object
    ['Infrastructure A']
  );
  field.id = id;
  return field;
};


describe('FieldController - Field Management E2E Tests', () => {
  let app: ExpressAdapter;
  let fieldRepository: IFieldRepository;
  let userRepository: IUserRepository;
  let adminRepository: IAdminRepository;
  let fieldAdminRepository: IFieldAdminRepository;
  let testAdmin: Admin;
  let testUser: User;

  beforeEach(async () => {
    const testContainer = container.createChildContainer();

    app = new ExpressAdapter();
    testContainer.register(Constants.HTTP, { useValue: app });

    userRepository = new UserRepositoryMemory();
    adminRepository = new AdminRepositoryMemory();
    fieldRepository = new FieldRepositoryMemory();
    fieldAdminRepository = new FieldAdminRepositoryMemory();

    testContainer.register(Constants.USER_REPOSITORY, { useValue: userRepository });
    testContainer.register(Constants.ADMIN_REPOSITORY, { useValue: adminRepository });
    testContainer.register(Constants.FIELD_REPOSITORY, { useValue: fieldRepository });
    testContainer.register(Constants.FIELD_ADMIN_REPOSITORY, { useValue: fieldAdminRepository });

    // Resolve controllers
    // UserController and AuthController might be needed if creating users/admins is done via API calls in setup.
    // For now, we'll create them directly in repositories.
    testContainer.resolve(FieldController);
    // testContainer.resolve(UserController);
    // testContainer.resolve(AuthController);


    // Setup a default admin for tests that need an adminId
    testUser = createTestUser('adminUserForFieldTests');
    await userRepository.create(testUser);
    testAdmin = await createTestAdmin(testUser, adminRepository);
  });

  describe('POST /fields (Register Field)', () => {
    it('should register a new field successfully', async () => {
      const fieldData: RegisterFieldDto = {
        name: 'Sunset Arena',
        address: '123 Sunset Blvd',
        description: 'Outdoor CQB field',
        photos: ['sunset1.jpg', 'sunset2.jpg'],
        rules: 'No full auto indoors.',
        adminId: testAdmin.id,
        infrastructure: 'Restrooms, Parking',
      };

      const response = await request(app.getInstance())
        .post('/fields')
        .send(fieldData);

      expect(response.status).toBe(201); // Typically 201 for created
      expect(response.body.field).toBeDefined();
      expect(response.body.field.name).toBe(fieldData.name);
      expect(response.body.field.address).toBe(fieldData.address);
      expect(response.body.field.adminId).toBe(testAdmin.id);

      const createdField = await fieldRepository.findById(response.body.field.id);
      expect(createdField).toBeDefined();
      expect(createdField?.name).toBe(fieldData.name);
    });

    it('should return 400 for missing required fields', async () => {
      const fieldData = { // Missing name, address etc.
        adminId: testAdmin.id,
      };
      const response = await request(app.getInstance())
        .post('/fields')
        .send(fieldData);
      expect(response.status).toBe(400); // Or 422
    });

    it('should return 404 if adminId is invalid (ADMIN_NOT_FOUND)', async () => {
      const fieldData: RegisterFieldDto = {
        name: 'Alpha Field',
        address: '456 Alpha St',
        description: 'Woodland area',
        photos: ['alpha1.jpg'],
        rules: 'Biodegradable BBs only.',
        adminId: 'non-existent-admin-id',
        infrastructure: 'Water station',
      };
      const response = await request(app.getInstance())
        .post('/fields')
        .send(fieldData);
      // This depends on the RegisterField use case error handling for AdminNotFound
      expect(response.status).toBe(404);
    });
  });

  // GET /fields tests will be added next
  describe('GET /fields', () => {
    it('should return an empty array when no fields exist', async () => {
      const response = await request(app.getInstance()).get('/fields');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return an array of fields when fields exist', async () => {
      const field1 = createTestField('f1', testAdmin.id);
      const field2 = createTestField('f2', testAdmin.id);
      await fieldRepository.create(field1);
      await fieldRepository.create(field2);

      const response = await request(app.getInstance()).get('/fields');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body.some((f: Field) => f.id === field1.id)).toBeTruthy();
      expect(response.body.some((f: Field) => f.id === field2.id)).toBeTruthy();
    });
  });

  // GET /fields/:fieldId tests will be added next
  describe('GET /fields/:fieldId', () => {
    it('should return a field when a valid fieldId is provided', async () => {
      const field = createTestField('f1', testAdmin.id);
      await fieldRepository.create(field);

      const response = await request(app.getInstance()).get(`/fields/${field.id}`);
      expect(response.status).toBe(200);
      expect(response.body.field).toBeDefined();
      expect(response.body.field.id).toBe(field.id);
      expect(response.body.field.name).toBe(field.name);
    });

    it('should return 404 when an invalid fieldId is provided', async () => {
      const response = await request(app.getInstance()).get('/fields/non-existent-id');
      expect(response.status).toBe(404); // Assuming FieldNotFound leads to 404
    });
  });

  // PUT /fields/:fieldId tests will be added next
  describe('PUT /fields/:fieldId', () => {
    let existingField: Field;

    beforeEach(async () => {
      existingField = createTestField('editField1', testAdmin.id);
      await fieldRepository.create(existingField);
    });

    it('should update an existing field successfully', async () => {
      const updateData: EditFieldDto = {
        name: 'Updated Field Name',
        description: 'Updated description.',
        rules: 'Updated rules.',
      };

      const response = await request(app.getInstance())
        .put(`/fields/${existingField.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.field).toBeDefined();
      expect(response.body.field.id).toBe(existingField.id);
      expect(response.body.field.name).toBe(updateData.name);
      expect(response.body.field.description).toBe(updateData.description);

      const updatedField = await fieldRepository.findById(existingField.id);
      expect(updatedField?.name).toBe(updateData.name);
    });

    it('should return 404 if fieldId is invalid (FIELD_NOT_FOUND)', async () => {
      const updateData: EditFieldDto = { name: 'Ghost Update' };
      const response = await request(app.getInstance())
        .put('/fields/non-existent-id')
        .send(updateData);
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid data in DTO', async () => {
      // Example: Sending a name that's too short if there was such a validation
      // For now, let's assume an empty name might be invalid if a use case enforces it.
      // This depends heavily on specific validations in EditField use case.
      // If no such validation exists, this test might need adjustment or removal.
      const updateData = { name: "" }; // Assuming name cannot be empty
      const response = await request(app.getInstance())
        .put(`/fields/${existingField.id}`)
        .send(updateData);
      // The actual status could be 400 or 422 depending on validation setup
      // For now, this test assumes some validation logic in the use case for non-empty name
      // If EditField allows empty name, this test would fail or need to test another invalid case
      expect(response.status).toBe(400); // Or check specific error if API provides one
    });
  });

  // POST /field-admins tests will be added next
  describe('POST /field-admins (Create Field Admin)', () => {
    let regularUser: User;

    beforeEach(async () => {
      regularUser = createTestUser('regularUserToBecomeFieldAdmin', 'unique');
      await userRepository.create(regularUser);
    });

    it('should create a field admin successfully', async () => {
      const dto: CreateFieldAdminDto = { userId: regularUser.id };
      const response = await request(app.getInstance())
        .post('/field-admins')
        .send(dto);

      expect(response.status).toBe(201);
      expect(response.body.fieldAdmin).toBeDefined();
      expect(response.body.fieldAdmin.userId).toBe(regularUser.id);
      // id for fieldAdmin might be different from userId, check if it exists
      expect(response.body.fieldAdmin.id).toBeDefined();

      const createdFieldAdmin = await fieldAdminRepository.findByUserId(regularUser.id);
      expect(createdFieldAdmin).toBeDefined();
      expect(createdFieldAdmin?.userId).toBe(regularUser.id);
    });

    it('should return 404 if userId is invalid (USER_NOT_FOUND)', async () => {
      const dto: CreateFieldAdminDto = { userId: 'non-existent-user-id' };
      const response = await request(app.getInstance())
        .post('/field-admins')
        .send(dto);
      expect(response.status).toBe(404);
    });

    it('should return 400 if user is already a field admin (FIELD_ADMIN_ALREADY_EXISTS)', async () => {
      // First, make the user a field admin
      const fieldAdmin = new FieldAdmin(regularUser.id);
      await fieldAdminRepository.create(fieldAdmin);

      const dto: CreateFieldAdminDto = { userId: regularUser.id };
      const response = await request(app.getInstance())
        .post('/field-admins')
        .send(dto);
      // This status code depends on how FieldAdminAlreadyExistsError is handled.
      // 409 (Conflict) is common, but 400 is also possible. Let's use 400.
      expect(response.status).toBe(400);
    });
  });
});
