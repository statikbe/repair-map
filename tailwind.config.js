const { tailwindConfig } = require('@statikbe/repair-components');

module.exports = {
  presets: [tailwindConfig],
  corePlugins: {
    preflight: false,
  },
  important: '#repair-map',
  mode: 'jit',
  purge: {
    content: [
      './src/components/**/*.vue',
      '**/*.vue',
      './node_modules/@statikbe/repair-components/**/*.{vue,js}',
      './node_modules/@statikbe/repair-components/safelist.txt',
      './safelist.txt',
    ],
  },
};
