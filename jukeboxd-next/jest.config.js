import nextJest from "next/jest.js";
import dotenv from "dotenv";

const createJestConfig = nextJest({
  dir: "./",
});

// Load environment variables from `.env` file
dotenv.config();

// Get ROOT_DIR from environment variable or fallback to current directory
const ROOT_DIR = process.env.ROOT_DIR || process.cwd();

const jestConfig = {
  testEnvironment: "node",
  testEnvironmentOptions: {}, 
  setupFilesAfterEnv: [`${ROOT_DIR}/jest.setup.js`],
  watchPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/build/"],
  globalTeardown: `${ROOT_DIR}/jest.globalTeardown.js`,
};

export default createJestConfig(jestConfig);
