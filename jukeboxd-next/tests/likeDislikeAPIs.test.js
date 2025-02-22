import * as firebaseApi from '../src/backend/firebase_api';

/** CREATE LIKE API */
describe('createLike', () => {
    test('Expected Behavior: increments like count', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => ({ likes: 1 }) });
      await firebaseApi.createLike('comment1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { likes: 2 });
    });

    test('Counterfactual: throws error for non-existent comment', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.createLike('nonexistent')).rejects.toThrow('Comment/Review does not exist');
    });

    test('Robustness: handles undefined likes', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => ({}) });
      await firebaseApi.createLike('comment1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { likes: 1 });
    });
  });

  /** CREATE DISLIKE API */
  describe('createDislike', () => {
    test('Expected Behavior: increments dislike count', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => ({ dislikes: 1 }) });
      await firebaseApi.createDislike('comment1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { dislikes: 2 });
    });

    test('Counterfactual: throws error for non-existent comment', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.createDislike('nonexistent')).rejects.toThrow('Comment/Review does not exist');
    });

    test('Robustness: handles undefined dislikes', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => ({}) });
      await firebaseApi.createDislike('comment1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { dislikes: 1 });
    });
  });

  /** DELETE LIKE API */
  describe('deleteLike', () => {
    test('Expected Behavior: decrements like count', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => ({ likes: 2 }) });
      await firebaseApi.deleteLike('comment1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { likes: 1 });
    });

    test('Counterfactual: throws error for non-existent comment', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.deleteLike('nonexistent')).rejects.toThrow('Comment/Review does not exist');
    });

    test('Robustness: prevents negative like count', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => ({ likes: 0 }) });
      await firebaseApi.deleteLike('comment1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { likes: 0 });
    });
  });

  /** DELETE DISLIKE API */
  describe('deleteDislike', () => {
    test('Expected Behavior: decrements dislike count', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => ({ dislikes: 2 }) });
      await firebaseApi.deleteDislike('comment1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { dislikes: 1 });
    });

    test('Counterfactual: throws error for non-existent comment', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.deleteDislike('nonexistent')).rejects.toThrow('Comment/Review does not exist');
    });

    test('Robustness: prevents negative dislike count', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => ({ dislikes: 0 }) });
      await firebaseApi.deleteDislike('comment1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { dislikes: 0 });
    });
  });
