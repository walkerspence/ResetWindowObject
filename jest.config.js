module.exports = {
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/tests/',
    '.+\\.(css|scss)$',
  ],
  setupFilesAfterEnv: ['<rootDir>/setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    contentType: 'text/html',
    pretendToBeVisual: true,
    referrer: 'https://me.com/',
    url: 'https://me.com/',
    userAgent: 'node.js',
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  globals: {
    TextEncoder: require("util").TextEncoder,
    TextDecoder: require("util").TextDecoder
  }
};
