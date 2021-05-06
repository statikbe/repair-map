const merge = require('lodash.merge');
const repairConfig = require('repair-components/tailwind/config');
const safelist = require('repair-components/tailwind/safelist');

module.exports = merge(repairConfig, {
  mode: 'jit',
  purge: {
    content: ['**/*.vue', './node_modules/repair-components/**/*.{vue,js}'],
    options: {
      safelist,
    },
  },
});
