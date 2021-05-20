const merge = require('lodash.merge');
const { tailwindConfig } = require('repair-components');
// const safelist = require('repair-components/tailwind/safelist');

module.exports = merge(tailwindConfig, {
  mode: 'jit',
  purge: {
    content: ['**/*.vue', './node_modules/repair-components/**/*.{vue,js}'],
    options: {
      // safelist,
    },
  },
});
