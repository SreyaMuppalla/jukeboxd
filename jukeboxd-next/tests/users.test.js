import {
    getUser,
    checkUser,
    createUser,
    updateUserBio,
    updateUserProfilePicture,
    usernameExists,
    followUser,
    UnfollowUser,
  } from "../src/backend/users";
  import { doc, getDoc } from "firebase/firestore";
  
  // Function to generate unique user IDs
  const randomUserId = () => `user_${Math.floor(Math.random() * 1000000)}`;
  const randomEmail = () => `user${Math.floor(Math.random() * 1000000)}@example.com`;
  
  describe("Firestore User API Tests", () => {
    beforeAll(async () => {
      // Wait until Firebase Emulator is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  
    /** Get User */
    describe("Get User API", () => {
      test("Expected Behavior: Should retrieve an existing user", async () => {
        const userId = randomUserId();
        await createUser(userId, "testuser", randomEmail(), "pic.jpg", "Test bio");
  
        const user = await getUser(userId);
        expect(user.username).toBe("testuser");
      });
  
      test("Counterfactual: Should throw an error for a non-existent user", async () => {
        await expect(getUser("nonexistent_user")).rejects.toThrow("User not found");
      });
  
      test("Robustness: Should throw an error when user ID is null", async () => {
        await expect(getUser(null)).rejects.toThrow("Missing user_id parameter");
      });
    });
  
    /** Check User */
    describe("Check User API", () => {
      test("Expected Behavior: Should return true for an existing user", async () => {
        const userId = randomUserId();
        await createUser(userId, "existinguser", randomEmail(), "pic.jpg", "Test bio");
  
        const exists = await checkUser(userId);
        expect(exists).toBe(true);
      });
  
      test("Counterfactual: Should return false for a non-existent user", async () => {
        const exists = await checkUser("nonexistent_user");
        expect(exists).toBe(false);
      });
  
      test("Robustness: Should throw an error when user ID is null", async () => {
        await expect(checkUser(null)).rejects.toThrow("Missing user_id parameter");
      });
    });
  
    /** Create User */
    describe("Create User API", () => {
      test("Expected Behavior: Should create a new user", async () => {
        const userId = randomUserId();
        const user = await createUser(userId, "newuser", randomEmail(), "profilePic.jpg", "User bio");
  
        expect(user.username).toBe("newuser");
  
        // Verify user exists in Firestore
        const userDoc = await getDoc(doc(global.firebaseDb, "users", userId));
        expect(userDoc.exists()).toBe(true);
      });
  
      test("Counterfactual: Should throw an error if user already exists", async () => {
        const userId = randomUserId();
        await createUser(userId, "duplicateuser", randomEmail(), "pic.jpg", "Bio");
  
        await expect(
          createUser(userId, "duplicateuser", randomEmail(), "pic.jpg", "Bio")
        ).rejects.toThrow("User already exists");
      });
  
      test("Robustness: Should throw an error if missing user ID", async () => {
        await expect(createUser(null, "testuser", randomEmail(), "pic.jpg", "Bio")).rejects.toThrow(
          "Missing user_id parameter"
        );
      });
  
      test("Robustness: Should throw an error if missing email", async () => {
        const userId = randomUserId();
        await expect(createUser(userId, "testuser", null, "pic.jpg", "Bio")).rejects.toThrow(
          "Missing email parameter"
        );
      });
    });
  
    /** Update User Bio */
    describe("Update User Bio API", () => {
      test("Expected Behavior: Should update the user's bio", async () => {
        const userId = randomUserId();
        await createUser(userId, "userWithBio", randomEmail(), "pic.jpg", "Old bio");
  
        const response = await updateUserBio(userId, "New bio");
        expect(response.message).toBe("User bio updated successfully");
  
        // Verify in Firestore
        const user = await getUser(userId);
        expect(user.user_bio).toBe("New bio");
      });
  
      test("Counterfactual: Should throw an error when user does not exist", async () => {
        await expect(updateUserBio("nonexistent_user", "New bio")).rejects.toThrow("User not found");
      });
  
      test("Robustness: Should throw an error when bio is null", async () => {
        const userId = randomUserId();
        await createUser(userId, "userWithBio", randomEmail(), "pic.jpg", "Old bio");
  
        await expect(updateUserBio(userId, null)).rejects.toThrow("Missing user_id or new_bio parameter");
      });
    });
  
    /** Update User Profile Picture */
    describe("Update User Profile Picture API", () => {
      test("Expected Behavior: Should update the user's profile picture", async () => {
        const userId = randomUserId();
        await createUser(userId, "userWithPic", randomEmail(), "oldPic.jpg", "Bio");
  
        const response = await updateUserProfilePicture(userId, "newPic.jpg");
        expect(response.message).toBe("Profile picture updated successfully");
  
        // Verify in Firestore
        const user = await getUser(userId);
        expect(user.profilePicture).toBe("newPic.jpg");
      });
  
      test("Counterfactual: Should throw an error when user does not exist", async () => {
        await expect(updateUserProfilePicture("nonexistent_user", "pic.jpg")).rejects.toThrow(
          "User not found"
        );
      });
  
      test("Robustness: Should throw an error when profile picture URL is null", async () => {
        const userId = randomUserId();
        await createUser(userId, "userWithPic", randomEmail(), "oldPic.jpg", "Bio");
  
        await expect(updateUserProfilePicture(userId, null)).rejects.toThrow(
          "Missing user_id or profile_picture_url parameter"
        );
      });
    });
  
    /** Existing Username */
    describe("Username Exists API", () => {
      test("Expected Behavior: Should return true if username exists", async () => {
        await createUser(randomUserId(), "uniqueUser", randomEmail(), "pic.jpg", "Bio");
  
        const exists = await usernameExists("uniqueUser");
        expect(exists).toBe(true);
      });
  
      test("Counterfactual: Should return false if username does not exist", async () => {
        const exists = await usernameExists("nonexistentUser");
        expect(exists).toBe(false);
      });
  
      test("Robustness: Should throw an error when username is null", async () => {
        await expect(usernameExists(null)).rejects.toThrow("Missing username parameter");
      });
    });
  
    /** Follow User */
    describe("Follow User API", () => {
      test("Expected Behavior: Should allow a user to follow another user", async () => {
        const userId1 = randomUserId();
        const userId2 = randomUserId();
  
        await createUser(userId1, "user1", randomEmail(), "pic.jpg", "Bio");
        await createUser(userId2, "user2", randomEmail(), "pic.jpg", "Bio");
  
        const response = await followUser(userId1, userId2);
        expect(response.message).toBe("User followed successfully");
      });
  
      test("Counterfactual: Should throw an error when user does not exist", async () => {
        await expect(followUser("nonexistent_user", "another_user")).rejects.toThrow("User not found");
      });
  
      test("Robustness: Should throw an error when user_id is null", async () => {
        await expect(followUser(null, "friend_id")).rejects.toThrow("Missing user_id or friend_id parameter");
      });
    });
  });  