import { addArtistById, getArtistById } from "../src/backend/artists";
import { doc, getDoc } from "firebase/firestore";

describe("Firestore Artist API Tests", () => {
    beforeAll(async () => {
        // Wait till Firebase Emulator is ready
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    /** Add Artist */
    describe("Add Artist API", () => {
        test("Expected Behavior: Should add an artist to Firestore", async () => {
            const artistId = `artist_${Math.floor(Math.random() * 1000000)}`;
            const artistData = {
                id: artistId,
                name: "Test Artist"
            };

            await addArtistById(artistId, artistData);

            // Verify artist exists in Firestore
            const artistDoc = await getDoc(doc(global.firebaseDb, "artists", artistId));
            expect(artistDoc.exists()).toBe(true);
            expect(artistDoc.data().name).toBe("Test Artist");
        });

        test("Counterfactual: Should throw an error when artistId is missing", async () => {
            await expect(addArtistById(null, {})).rejects.toThrow("Missing artistId parameter");
        });

        test("Robustness: Should throw an error when artist data is missing", async () => {
            const artistId = `artist_${Math.floor(Math.random() * 1000000)}`;
            await expect(addArtistById(artistId, null)).rejects.toThrow("Missing artistData parameter");
        });
    });

    /** Get Artist */
    describe("Get Artist API", () => {
        test("Expected Behavior: Should retrieve an existing artist", async () => {
            const artistId = `artist_${Math.floor(Math.random() * 1000000)}`;
            const artistData = {
                id: artistId,
                name: "Retrieved Artist"
            };

            await addArtistById(artistId, artistData);
            const artist = await getArtistById(artistId);

            expect(artist.name).toBe("Retrieved Artist");
        });

        test("Counterfactual: Should return null for a non-existent artist", async () => {
            const artist = await getArtistById("nonexistent_artist");
            expect(artist).toBeNull();
        });

        test("Robustness: Should throw an error when artistId is null", async () => {
            await expect(getArtistById(null)).rejects.toThrow("Missing artistId parameter");
        });
    });
});
