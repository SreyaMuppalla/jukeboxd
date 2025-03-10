import { 
    addAlbumById, 
    getAlbumById, 
    addAlbumReviewScore 
} from "../src/backend/albums";

import { doc, getDoc, setDoc } from "firebase/firestore";

describe("Firestore Album API Tests", () => {
    beforeAll(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    const testAlbumId = "test_album_1";

    beforeEach(async () => {
        await setDoc(doc(global.firebaseDb, "albums", testAlbumId), {
            name: "Test Album",
            artists: [{ id: "artist_1", name: "Test Artist" }],
            images: [],
            review_score: 0,
            num_reviews: 0
        });
    });

    /** Add Album */
    describe("Add Album API", () => {
        test("Should add a new album", async () => {
            const albumId = "album_123";
            const albumData = {
                id: albumId,
                name: "New Album",
                artists: [{ id: "artist_1", name: "Test Artist" }],
                images: [],
                review_score: 0,
                num_reviews: 0
            };

            await addAlbumById(albumId, albumData);

            const albumDoc = await getDoc(doc(global.firebaseDb, "albums", albumId));
            expect(albumDoc.exists()).toBe(true);
            expect(albumDoc.data().name).toBe("New Album");
        });

        test("Should throw an error when albumId is missing", async () => {
            const albumData = { name: "Album Without ID" };
            await expect(addAlbumById(null, albumData)).rejects.toThrow("Missing albumId parameter");
        });

        test("Should throw an error when albumData is missing", async () => {
            await expect(addAlbumById("album_no_data", null)).rejects.toThrow("Missing albumData parameter");
        });
    });

    /** Get Album */
    describe("Get Album API", () => {
        test("Should retrieve an existing album", async () => {
            const album = await getAlbumById(testAlbumId);
            expect(album).not.toBeNull();
            expect(album.name).toBe("Test Album");
        });

        test("Should return null for a non-existent album", async () => {
            const album = await getAlbumById("non_existent_album");
            expect(album).toBeNull();
        });

        test("Should throw an error when albumId is missing", async () => {
            await expect(getAlbumById(null)).rejects.toThrow("Missing albumId parameter");
        });
    });

    /** Add Album Review Score */
    describe("Add Album Review Score API", () => {
        test("Should update review score and number of reviews", async () => {
            await addAlbumReviewScore(testAlbumId, 4);

            const albumDoc = await getDoc(doc(global.firebaseDb, "albums", testAlbumId));
            expect(albumDoc.data().review_score).toBe(4);
            expect(albumDoc.data().num_reviews).toBe(1);
        });

        test("Should throw an error for non-existent album", async () => {
            await expect(addAlbumReviewScore("non_existent_album", 5)).rejects.toThrow("Album does not exist!");
        });

        test("Should throw an error when albumId is missing", async () => {
            await expect(addAlbumReviewScore(null, 5)).rejects.toThrow("Missing albumId parameter");
        });

        test("Should throw an error when reviewScore is not a number", async () => {
            await expect(addAlbumReviewScore(testAlbumId, "not_a_number")).rejects.toThrow("Review score must be a number");
        });
    });
});