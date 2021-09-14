const { tailwindConfig } = require('@statikbe/repair-components');

module.exports = {
  presets: [tailwindConfig],
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
