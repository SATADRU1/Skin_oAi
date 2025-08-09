const { getDefaultConfig } = require("expo/metro-config");
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript and TypeScript with React
config.resolver.sourceExts.push("ts", "tsx");

// Add path alias support
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@': path.resolve(__dirname, './'),
};

module.exports = config;
