module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // NativeWind's babel preset already injects the worklets plugin last.
      ['babel-preset-expo', { jsxImportSource: 'nativewind', worklets: false, reanimated: false }],
      'nativewind/babel',
    ],
  };
};
