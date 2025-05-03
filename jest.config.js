/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment : "node",
  transform : {
    "^.+\.ts?$" : [ "ts-jest", {} ],
  }, 
  modulePaths: [ "<rootDir>" ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/../src/$1",
    "^@test/(.*)$": "<rootDir>/$1"
  }, 
  rootDir: "test",
  moduleFileExtensions: ["js", "ts"]
};
