import * as firebaseApi from '../src/backend/firebase_api';

/** GET USER API */
describe('getUser', () => {
    test('Expected Behavior: retrieves an existing user', async () => {
      const mockUser = { user_name: 'testuser', bio: 'Test bio' };
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => mockUser });
      const user = await firebaseApi.getUser('user1');
      expect(user).toEqual(mockUser);
    });

    test('Counterfactual: throws error when user does not exist', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.getUser('nonexistent')).rejects.toThrow('User does not exist');
    });

    test('Robustness: handles null user ID', async () => {
      await expect(firebaseApi.getUser(null)).rejects.toThrow('User ID is required');
    });
  });

  /** CREATE USER API */
  describe('createUser', () => {
    test('Expected Behavior: creates a new user', async () => {
      mockGetDocs.mockReturnValueOnce({ empty: true });
      await firebaseApi.createUser('pic.jpg', 'newuser', 'New bio');
      expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        user_name: 'newuser',
        bio: 'New bio'
      }));
    });

    test('Counterfactual: throws error when username already exists', async () => {
      mockGetDocs.mockReturnValueOnce({ empty: false });
      await expect(firebaseApi.createUser('pic.jpg', 'existinguser', 'Bio')).rejects.toThrow('Username already exists');
    });

    test('Robustness: handles missing parameters', async () => {
      await expect(firebaseApi.createUser()).rejects.toThrow();
    });
  });

  /** UPDATE USER PIC API */
  describe('updateUserPic', () => {
    test('Expected Behavior: updates user profile picture', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true });
      await firebaseApi.updateUserPic('user1', 'newpic.jpg');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { prof_pic: 'newpic.jpg' });
    });

    test('Counterfactual: throws error when user does not exist', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.updateUserPic('nonexistent', 'pic.jpg')).rejects.toThrow('User does not exist');
    });

    test('Robustness: handles invalid user ID type', async () => {
      await expect(firebaseApi.updateUserPic(123, 'pic.jpg')).rejects.toThrow();
    });
  });

  /** UPDATE USER BIO API */
  describe('updateUserBio', () => {
    test('Expected Behavior: updates user bio', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true });
      await firebaseApi.updateUserBio('user1', 'New bio');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { bio: 'New bio' });
    });

    test('Counterfactual: throws error when user does not exist', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.updateUserBio('nonexistent', 'Bio')).rejects.toThrow('User does not exist');
    });

    test('Robustness: handles empty bio', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true });
      await firebaseApi.updateUserBio('user1', '');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { bio: '' });
    });
  });

  /** UPDATE BOOKMARKED SONG API */
  describe('updateBookmarkedSong', () => {
    test('Expected Behavior: adds a song to bookmarks', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true });
      await firebaseApi.updateBookmarkedSong('user1', 'song1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { bookmarked_songs: mockArrayUnion('song1') });
    });

    test('Counterfactual: throws error when user does not exist', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.updateBookmarkedSong('nonexistent', 'song1')).rejects.toThrow('User does not exist');
    });

    test('Robustness: handles null song', async () => {
      await expect(firebaseApi.updateBookmarkedSong('user1', null)).rejects.toThrow();
    });
  });

  /** DELETE BOOKMARKED SONG API */
  describe('deleteBookmarkedSong', () => {
    test('Expected Behavior: removes a song from bookmarks', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => ({ bookmarked_songs: ['song1'] }) });
      await firebaseApi.deleteBookmarkedSong('user1', 'song1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { bookmarked_songs: mockArrayRemove('song1') });
    });

    test('Counterfactual: throws error when song not in bookmarks', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => ({ bookmarked_songs: [] }) });
      await expect(firebaseApi.deleteBookmarkedSong('user1', 'song1')).rejects.toThrow('Song not found in bookmarks');
    });

    test('Robustness: handles non-existent user', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.deleteBookmarkedSong('nonexistent', 'song1')).rejects.toThrow('User does not exist');
    });
  });

  /** UPDATE FOLLOWER API */
  describe('updateFollower', () => {
    test('Expected Behavior: updates follower relationship', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true }).mockReturnValueOnce({ exists: () => true });
      await firebaseApi.updateFollower('user1', 'user2');
      expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
    });

    test('Counterfactual: throws error when one user does not exist', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true }).mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.updateFollower('user1', 'nonexistent')).rejects.toThrow('One or both users do not exist');
    });

    test('Robustness: handles same user IDs', async () => {
      await expect(firebaseApi.updateFollower('user1', 'user1')).rejects.toThrow();
    });
  });