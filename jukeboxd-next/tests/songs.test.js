import {
    addSongById,
    getSongById,
    addSongReviewScore
  } from "../src/backend/songs";
  import { doc, getDoc } from "firebase/firestore";
  
  // Function to generate unique song IDs
  const randomSongId = () => `song_${Math.floor(Math.random() * 1000000)}`;
  
  describe("Firestore Song API Tests", () => {
    beforeAll(async () => {
      // Wait till Firebase Emulator is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  
    describe("Add Song API", () => {
        test("Expected Behavior: Should add a song to Firestore", async () => {
            const songId = randomSongId();
            const songData = {
                id: songId,
                name: "Test Song",
                album: { id: "album123", name: "Test Album" },
                artists: [{ id: "artist123", name: "Test Artist" }],
                images: [],
                review_score: 0,
                num_reviews: 0
            };
    
            await addSongById(songId, songData);
    
            const songDoc = await getDoc(doc(global.firebaseDb, "songs", songId));
            expect(songDoc.exists()).toBe(true);
            expect(songDoc.data().name).toBe("Test Song");
        });
    
        test("Counterfactual: Should throw an error when songId is missing", async () => {
            await expect(addSongById(null, {})).rejects.toThrow("Missing songId parameter");
        });
    
        test("Robustness: Should throw an error when song data is missing", async () => {
            const songId = randomSongId();
            await expect(addSongById(songId, null)).rejects.toThrow("Missing songData parameter");
        });
    });
    
  
    /** Get Song */
    describe("Get Song API", () => {
      test("Expected Behavior: Should retrieve an existing song", async () => {
        const songId = randomSongId();
        const songData = {
          id: songId,
          name: "Retrieved Song",
          album: { id: "album321", name: "Retrieved Album" },
          artists: [{ id: "artist321", name: "Retrieved Artist" }],
          images: [],
          review_score: 0,
          num_reviews: 0
        };
  
        await addSongById(songId, songData);
        const song = await getSongById(songId);
  
        expect(song.name).toBe("Retrieved Song");
        expect(song.album.name).toBe("Retrieved Album");
      });
  
      test("Counterfactual: Should return null for a non-existent song", async () => {
        const song = await getSongById("nonexistent_song");
        expect(song).toBeNull();
      });
  
      test("Robustness: Should throw an error when songId is null", async () => {
        await expect(getSongById(null)).rejects.toThrow();
      });
    });
  
    /** Add Song Review Score */
    describe("Add Song Review Score API", () => {
      test("Expected Behavior: Should add a review score to a song", async () => {
        const songId = randomSongId();
        const songData = {
          id: songId,
          name: "Scored Song",
          album: { id: "album999", name: "Scored Album" },
          artists: [{ id: "artist999", name: "Scored Artist" }],
          images: [],
          review_score: 10,
          num_reviews: 2
        };
  
        await addSongById(songId, songData);
        await addSongReviewScore(songId, 5); // Adding a score of 5
  
        // Verify in Firestore
        const song = await getSongById(songId);
        expect(song.review_score).toBe(15); // 10 + 5
        expect(song.num_reviews).toBe(3); // 2 + 1
      });
  
      test("Counterfactual: Should throw an error when song does not exist", async () => {
        await expect(addSongReviewScore("nonexistent_song", 5)).rejects.toThrow("Song does not exist!");
      });
  
      test("Robustness: Should throw an error when songId is null", async () => {
        await expect(addSongReviewScore(null, 5)).rejects.toThrow();
      });
  
      test("Robustness: Should throw an error when reviewScore is null", async () => {
        const songId = randomSongId();
        await expect(addSongReviewScore(songId, null)).rejects.toThrow();
      });
    });
  });
  