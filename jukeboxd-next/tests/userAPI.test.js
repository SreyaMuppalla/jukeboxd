import { mockFirebase } from 'firestore-jest-mock';
import { mockGetDoc, mockSetDoc } from 'firestore-jest-mock/mocks/firestore';
import mockDatabase from './__mocks__/mockFirestore';
import * as firebaseApi from '../src/backend/firebase_api';

// Mock Firebase before importing your functions
mockFirebase({ database: mockDatabase });

describe('User API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('addUser handles null user data', async () => {
    await expect(firebaseApi.addUser('user3', null)).rejects.toThrow();
  });

  test('addUser adds a new user to the database', async () => {
    const userId = 'user3';
    const userData = { username: 'newuser', email: 'newuser@example.com' };
    await firebaseApi.addUser(userId, userData);
    expect(mockSetDoc).toHaveBeenCalledWith(expect.anything(), userData);
  });

  test('getUser returns null for non-existent user', async () => {
    const user = await firebaseApi.getUser('non-existent-user');
    expect(user).toBeNull();
  });

  test('getUser retrieves an existing user', async () => {
    const userId = 'user1';
    const user = await firebaseApi.getUser(userId);
    expect(user).toEqual(mockDatabase.users[0]);
    expect(mockGetDoc).toHaveBeenCalled();
  });

});

