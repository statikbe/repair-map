import { icons } from 'repair-components';

import RepairMap from '../src/RepairMap.vue';
import i18n from '../src/i18n';

export default {
  install(Vue) {
    Vue.component('repair-map', RepairMap);

    Vue.prototype.$icons = Vue.prototype.$icons || icons;
    Vue.prototype.$i18n = i18n;
  },
};
