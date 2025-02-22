import * as firebaseApi from '../src/backend/firebase_api';

/** CREATE REVIEW API */
describe('createReview', () => {
    test('Expected Behavior: creates a new review', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => true });
      await firebaseApi.createReview('user1', true, 'Song Name', 4, 'Great song!');
      expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        user_id: 'user1',
        is_song: true,
        name: 'Song Name',
        rating: 4,
        review_text: 'Great song!'
      }));
    });

    test('Counterfactual: throws error when user does not exist', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.createReview('nonexistent', true, 'Song', 4, 'Text'))
        .rejects.toThrow('User does not exist');
    });

    test('Robustness: handles missing parameters', async () => {
      await expect(firebaseApi.createReview()).rejects.toThrow('Missing or invalid required parameters');
    });
  });

  /** GET REVIEW API */
  describe('getReview', () => {
    test('Expected Behavior: retrieves an existing review', async () => {
      const mockReview = { rating: 4, review_text: 'Great!', likes: 2, dislikes: 1, comments: ['comment1'] };
      mockGetDoc.mockReturnValueOnce({ exists: () => true, data: () => mockReview });
      const review = await firebaseApi.getReview('user1', 'review1');
      expect(review).toEqual(expect.objectContaining(mockReview));
    });

    test('Counterfactual: throws error when review not found', async () => {
      mockGetDoc.mockReturnValueOnce({ exists: () => false });
      await expect(firebaseApi.getReview('user1', 'nonexistent')).rejects.toThrow('Review not found');
    });

    test('Robustness: handles missing parameters', async () => {
      await expect(firebaseApi.getReview()).rejects.toThrow('Missing required parameters');
    });
  });

  /** GET ALL REVIEWS FOR A SONG API */
  describe('getAllReviewsSong', () => {
    test('Expected Behavior: retrieves all reviews for a song', async () => {
      const mockReviews = [{ id: 'review1', text: 'Great!' }, { id: 'review2', text: 'Awesome!' }];
      mockGetDocs.mockReturnValueOnce({ docs: mockReviews.map(r => ({ id: r.id, data: () => r })) });
      const reviews = await firebaseApi.getAllReviewsSong('song1');
      expect(reviews).toEqual(mockReviews);
    });

    test('Counterfactual: returns empty array when no reviews exist', async () => {
      mockGetDocs.mockReturnValueOnce({ docs: [] });
      const reviews = await firebaseApi.getAllReviewsSong('song1');
      expect(reviews).toEqual([]);
    });

    test('Robustness: handles missing song name', async () => {
      await expect(firebaseApi.getAllReviewsSong()).rejects.toThrow('Song name is required');
    });
  });