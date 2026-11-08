module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@assets': './assets',
        },
      },
    ],
    ['react-native-worklets/plugin'],
  ],
};
