/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment : "node",
  transform : {
    "^.+\.ts?$" : [ "ts-jest", {} ],
  }, 
  modulePaths: [ "<rootDir>" ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@test/(.*)$": "<rootDir>/test/$1"
  }, 
  rootDir: ".",
  collectCoverage: true,
  moduleFileExtensions: ["js", "ts"],
};
