const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "/Users/user/Documents/GitHub/jukeboxd/jukeboxd-next/"],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["/Users/user/Documents/GitHub/jukeboxd/jukeboxd-next/jest.setup.js"], // Ensure Jest setup runs before tests
  moduleNameMapper: {
    "^mockFirestore$": "/Users/user/Documents/GitHub/jukeboxd/jukeboxd-next/tests/__mocks__/mockFirestore.js", // Map firebaseConfig to the mock
  },
};

module.exports = createJestConfig(customJestConfig);
