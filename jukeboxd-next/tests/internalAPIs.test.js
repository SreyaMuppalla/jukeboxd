import { mockFirebase } from 'firestore-jest-mock';
import mockDatabase from './__mocks__/mockFirestore';

// Mock Firebase before importing your functions
mockFirebase({ database: mockDatabase });

describe('Internal Firebase API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // placeholder test 1
  test("should return true", () => {
    expect(true).toBe(true);
  });

  // placeholder test 2
  test("should sum two numbers correctly", () => {
    const sum = (a, b) => a + b;
    expect(sum(2, 2)).toBe(4);
  });

});

