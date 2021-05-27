const merge = require('lodash.merge');
const { tailwindConfig } = require('repair-components');

module.exports = merge(tailwindConfig, {
  mode: 'jit',
  purge: {
    content: ['**/*.vue', './node_modules/repair-components/**/*.{vue,js}'],
    options: {
      whitelistPatterns: [/^multiselect(.*)/],
    },
  },
  important: '#repair-map',
});
