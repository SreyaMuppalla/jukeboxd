const nextJest = require("next/jest");
const dotenv = require("dotenv");

const createJestConfig = nextJest({
  dir: "./",
});

// Load environment variables from `.env` file
dotenv.config();

// Get ROOT_DIR from environment variable or fallback to current directory
const ROOT_DIR = process.env.ROOT_DIR || __dirname;

const customJestConfig = {
  moduleDirectories: ["node_modules", `${ROOT_DIR}/`],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: [`${ROOT_DIR}/jest.setup.js`], // Ensure Jest setup runs before tests
  moduleNameMapper: {
    "^mockFirestore$": `${ROOT_DIR}/tests/__mocks__/mockFirestore.js`, // Map firebaseConfig to the mock
  },
};

module.exports = createJestConfig(customJestConfig);
