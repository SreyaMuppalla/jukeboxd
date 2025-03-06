
import { createUserWithEmailAndPassword } from "firebase/auth";

describe("Firebase API Tests", () => {
  beforeAll(async () => {
    // Wait 1 second to make sure Firebase Emulator is ready
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  test("Should create a new user", async () => {
    const userCredential = await createUserWithEmailAndPassword(global.firebaseAuth, "test@example.com", "password123");
    expect(userCredential.user.email).toBe("test@example.com");
  });
});
