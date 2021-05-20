const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const merge = require('lodash.merge');

const twConfig = require('./tailwind.config');

//  This config is only to be used by Vitepress

module.exports = {
  important: false,
  plugins: [
    tailwindcss(
      merge({}, twConfig, {
        mode: 'jit',
        purge: {
          content: ['**/*.{vue,md,js}'],
        },
        corePlugins: {
          preflight: false,
        },
      })
    ),
    autoprefixer,
  ],
};
