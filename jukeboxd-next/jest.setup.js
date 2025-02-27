// jest.setup.js

import { mockFirebase } from 'firestore-jest-mock';
import mockDatabase from './tests/__mocks__/mockFirestore';

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  firestore: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  serverTimestamp: jest.fn(() => 'mocked-timestamp'),
  FieldValue: {
    serverTimestamp: jest.fn(() => 'mocked-timestamp')
  }
}));

// Setup mock database
mockFirebase({ database: mockDatabase });
