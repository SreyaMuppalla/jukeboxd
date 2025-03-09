import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  
  // Function to generate a unique random email
  const randomEmail = () => `user${Math.floor(Math.random() * 1000000)}@example.com`;
  
  describe("Firebase Authentication API Tests", () => {
    beforeAll(async () => {
      // ✅ Ensure Firebase Emulator is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  
    /** Sign-Up */
    describe("Sign-Up API", () => {
      test("Expected Behavior: Should sign up a new user", async () => {
        const email = randomEmail();
        const userCredential = await createUserWithEmailAndPassword(global.firebaseAuth, email, "securePassword");
  
        expect(userCredential.user.email).toBe(email);
      });
  
      test("Counterfactual: Should fail if email is already in use", async () => {
        const email = randomEmail();
        await createUserWithEmailAndPassword(global.firebaseAuth, email, "securePassword");
  
        await expect(
          createUserWithEmailAndPassword(global.firebaseAuth, email, "securePassword")
        ).rejects.toThrow("auth/email-already-in-use");
      });
  
      test("Robustness: Should fail if email is null", async () => {
        await expect(
          createUserWithEmailAndPassword(global.firebaseAuth, null, "password123")
        ).rejects.toThrow();
      });
  
      test("Robustness: Should fail if password is null", async () => {
        const email = randomEmail();
        await expect(
          createUserWithEmailAndPassword(global.firebaseAuth, email, null)
        ).rejects.toThrow();
      });
    });
  
    /** Sign-In */
    describe("Sign-In API", () => {
      test("Expected Behavior: Should sign in with email and password", async () => {
        const email = randomEmail();
        await createUserWithEmailAndPassword(global.firebaseAuth, email, "password123");
  
        const userCredential = await signInWithEmailAndPassword(global.firebaseAuth, email, "password123");
  
        expect(userCredential.user.email).toBe(email);
      });
  
      test("Counterfactual: Should fail with incorrect password", async () => {
        const email = randomEmail();
        await createUserWithEmailAndPassword(global.firebaseAuth, email, "correctpassword");
  
        await expect(
          signInWithEmailAndPassword(global.firebaseAuth, email, "wrongpassword")
        ).rejects.toThrow("auth/wrong-password");
      });
  
      test("Counterfactual: Should fail if email does not exist", async () => {
        await expect(
          signInWithEmailAndPassword(global.firebaseAuth, "nonexistent@example.com", "password123")
        ).rejects.toThrow("auth/user-not-found");
      });
  
      test("Robustness: Should fail if email is null", async () => {
        await expect(
          signInWithEmailAndPassword(global.firebaseAuth, null, "password123")
        ).rejects.toThrow();
      });
  
      test("Robustness: Should fail if password is null", async () => {
        const email = randomEmail();
        await createUserWithEmailAndPassword(global.firebaseAuth, email, "password123");
  
        await expect(
          signInWithEmailAndPassword(global.firebaseAuth, email, null)
        ).rejects.toThrow();
      });
    });
  
    /** Logout */
    describe("Logout API", () => {
      test("Expected Behavior: Should log out the user", async () => {
        await signOut(global.firebaseAuth);
        expect(global.firebaseAuth.currentUser).toBeNull();
      });
  
      test("Counterfactual: Should not throw error when logging out with no user", async () => {
        await expect(signOut(global.firebaseAuth)).resolves.not.toThrow();
      });
    });
  });
  