module.exports = {
  preset: "ts-jest",

  testPathIgnorePatterns: ["utils", "dist"],

  collectCoverage: true,
  collectCoverageFrom: ["src/**/*"]
};
