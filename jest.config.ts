import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  preset: "ts-jest",
  moduleNameMapper: {
    "^react$": "<rootDir>/node_modules/react",
    "^react-dom$": "<rootDir>/node_modules/react-dom",
    "^react-dom/client$": "<rootDir>/node_modules/react-dom/client",
    "^next/image$": "<rootDir>/__mocks__/next-image.js",
    "^@/components/(.*)$": "<rootDir>/components/$1",
    '^@/(.*)$': '<rootDir>/src/$1',
    // 1. Fix for Convex: Look in root folder, NOT src
    '^@/convex/(.*)$': '<rootDir>/convex/$1',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
