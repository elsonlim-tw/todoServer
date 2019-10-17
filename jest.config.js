module.exports = {
  preset: "@shelf/jest-mongodb",
  setupFilesAfterEnv: ["./jestSetup.js"],
  collectCoverageFrom: ["src/**/*.js", "!**/*.test.js", "!src/index.js"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
