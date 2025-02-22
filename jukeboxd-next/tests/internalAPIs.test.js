import { mockFirebase } from 'firestore-jest-mock';
import { mockCollection, mockDoc, mockGetDoc, mockSetDoc, mockAddDoc, mockGetDocs, mockUpdateDoc, mockWhere, mockQuery, mockArrayUnion, mockArrayRemove } from 'firestore-jest-mock/mocks/firestore';

// Import test suites
import './userAPIs.test';
import './reviewAPIs.test';
import './likeDislikeAPIs.test';

mockFirebase();

beforeEach(() => {
  jest.clearAllMocks();
});