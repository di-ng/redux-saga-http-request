module.exports = {
  transform: {
    '.(ts|tsx)':
    'node_modules/ts-jest/dist/index.js',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testMatch: ['<rootDir>/test/**/*.(spec|test).{ts,tsx}'],
  testURL: 'http://localhost',
  watchPlugins: [
    'node_modules/jest-watch-typeahead/filename.js',
    'node_modules/jest-watch-typeahead/testname.js',
  ],
};