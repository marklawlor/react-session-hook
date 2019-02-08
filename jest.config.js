module.exports = {
  preset: "ts-jest",

  testPathIgnorePatterns: ["utils"],

  collectCoverage: true,
  collectCoverageFrom: ["src/**/*"]
};
