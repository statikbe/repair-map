import repairComponents from 'repair-components';

import RepairMap from '../src/RepairMap.vue';
import messages from '../src/i18n';

import { i18n } from 'repair-components';

export default {
  install(Vue) {
    if (!Vue.prototype.i18n) {
      Vue.use(repairComponents);
    }

    Vue.component('repair-map', RepairMap);

    i18n.mergeLocaleMessage('de', messages.de);
    i18n.mergeLocaleMessage('en', messages.en);
    i18n.mergeLocaleMessage('fr', messages.fr);
    i18n.mergeLocaleMessage('nl', messages.nl);

    Vue.prototype.$localizeField = (field) => field[i18n.locale.split('-')[0]] || field.default;
  },
};
