import repairComponents from 'repair-components';

import RepairMap from '../src/RepairMap.vue';
import messages from '../src/i18n';

import { i18n } from 'repair-components';

export default {
  install(Vue, options) {
    Vue.use(repairComponents);

    Vue.component('repair-map', RepairMap);

    const _i18n = options.i18n || i18n;

    _i18n.mergeLocaleMessage('de', messages.de);
    _i18n.mergeLocaleMessage('en', messages.en);
    _i18n.mergeLocaleMessage('fr', messages.fr);
    _i18n.mergeLocaleMessage('nl', messages.nl);

    Vue.prototype.$localizeField = (field) => field[_i18n.locale.split('-')[0]] || field.default;
  },
};
