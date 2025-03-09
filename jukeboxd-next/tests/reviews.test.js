import { 
    getReviewById, 
    createReview, 
    getFriendReviews, 
    getReviews 
} from "../src/backend/reviews";

import { doc, getDoc, setDoc, collection } from "firebase/firestore";

describe("Firestore Review API Tests", () => {
    beforeAll(async () => {
        // Wait till Firebase Emulator is ready
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    const testUserId = "test_user_1";
    const testFriendId = "test_friend_1";

    beforeEach(async () => {
        // Ensure a test user exists before creating a review
        await setDoc(doc(global.firebaseDb, "users", testUserId), {
            username: "TestUser",
            reviews: [],
            following: [],
        });

        await setDoc(doc(global.firebaseDb, "users", testFriendId), {
            username: "FriendUser",
            reviews: [],
            following: [],
        });
    });

    /** Create Review */
    describe("Create Review API", () => {
        test("Should create a new review", async () => {
            const reviewData = {
                user_id: testUserId,
                username: "TestUser",
                rating: 5,
                type: "song",
                song_id: "test_song_1",
                song_name: "Test Song",
            };

            const reviewId = await createReview(reviewData);

            // Verify review exists in Firestore
            const reviewDoc = await getDoc(doc(global.firebaseDb, "reviews", reviewId));
            expect(reviewDoc.exists()).toBe(true);
            expect(reviewDoc.data().user_id).toBe(testUserId);
        });

        test("Should throw an error when user_id is missing", async () => {
            const reviewData = { rating: 5, type: "song", song_id: "test_song_1" };
            await expect(createReview(reviewData)).rejects.toThrow("Missing required fields: user_id");
        });

        test("Should throw an error when rating is not a number", async () => {
            const reviewData = { user_id: testUserId, rating: "five", type: "song", song_id: "test_song_1" };
            await expect(createReview(reviewData)).rejects.toThrow("Invalid rating parameter");
        });

        test("Should throw an error when neither song_id nor album_id is provided", async () => {
            const reviewData = { user_id: testUserId, rating: 5, type: "song" };
            await expect(createReview(reviewData)).rejects.toThrow("Need to provide either album_id or song_id");
        });
    });

    /** Get Review by ID */
    describe("Get Review API", () => {
        test("Should retrieve an existing review", async () => {
            const reviewData = {
                user_id: testUserId,
                rating: 4,
                type: "album",
                album_id: "test_album_2",
                album_name: "Test Album 2"
            };

            const reviewId = await createReview(reviewData);
            const review = await getReviewById(reviewId);

            expect(review.id).toBe(reviewId);
            expect(review.rating).toBe(4);
        });

        test("Should return error for non-existent review", async () => {
            await expect(getReviewById("nonexistent_review")).rejects.toThrow("Review not found");
        });

        test("Should throw an error when review_id is null", async () => {
            await expect(getReviewById(null)).rejects.toThrow("Missing review_id parameter");
        });
    });

    /** Get Friend Reviews API */
    describe("Get Friend Reviews API", () => {
        test("Should return friend reviews", async () => {
            // Simulate following relationship in Firestore
            await setDoc(doc(global.firebaseDb, "users", testUserId), {
                following: [testFriendId]
            });

            const reviewData = { user_id: testFriendId, rating: 5, type: "song", song_id: "test_song_3" };
            await createReview(reviewData);

            const friendReviews = await getFriendReviews(testUserId);
            expect(friendReviews.length).toBeGreaterThan(0);
            expect(friendReviews[0].user_id).toBe(testFriendId);
        });

        test("Should return empty array if user has no friends", async () => {
            await setDoc(doc(global.firebaseDb, "users", "user_with_no_friends"), {
                following: []
            });

            const friendReviews = await getFriendReviews("user_with_no_friends");
            expect(friendReviews).toEqual([]);
        });

        test("Should throw an error when user_id is null", async () => {
            await expect(getFriendReviews(null)).rejects.toThrow("Missing user_id parameter");
        });
    });

    /** Get Reviews for Item API */
    describe("Get Reviews API", () => {
        test("Should retrieve reviews for a song", async () => {
            const reviewData = { user_id: testUserId, rating: 5, type: "song", song_id: "test_song_4" };
            await createReview(reviewData);

            const reviews = await getReviews("test_song_4", "song");
            expect(reviews.length).toBeGreaterThan(0);
            expect(reviews[0].song_id).toBe("test_song_4");
        });

        test("Should retrieve reviews for an album", async () => {
            const reviewData = { user_id: testUserId, rating: 3, type: "album", album_id: "test_album_5" };
            await createReview(reviewData);

            const reviews = await getReviews("test_album_5", "album");
            expect(reviews.length).toBeGreaterThan(0);
            expect(reviews[0].album_id).toBe("test_album_5");
        });

        test("Should return empty array for an item with no reviews", async () => {
            const reviews = await getReviews("nonexistent_item", "song");
            expect(reviews).toEqual([]);
        });

        test("Should throw an error when item_id is missing", async () => {
            await expect(getReviews(null, "song")).rejects.toThrow("Missing item_id parameter");
        });

        test("Should throw an error when song_or_album is missing", async () => {
            await expect(getReviews("test_song_6", null)).rejects.toThrow("Missing song_or_album parameter");
        });
    });
});
