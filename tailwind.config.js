const { tailwindConfig } = require('repair-components');

module.exports = {
  presets: [tailwindConfig],
  mode: 'jit',
  purge: {
    content: [
      './src/components/**/*.vue',
      '**/*.vue',
      './node_modules/repair-components/**/*.{vue,js}',
      './node_modules/repair-components/safelist.txt',
      './safelist.txt',
    ],
  },
};
