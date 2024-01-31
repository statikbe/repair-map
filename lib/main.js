import { default as repairComponents, i18n } from '@statikbe/repair-components';

import RepairMap from '../src/RepairMap.vue';
import OrdpMap from '../src/OrdpMap';

import messages from '../src/i18n';
import VueApollo from 'vue-apollo';

const isBrowser = typeof window !== 'undefined';

let i18nInstance;

const Plugin = {
  install(Vue, options = {}) {
    Vue.use(VueApollo);
    Vue.options = Vue.util.mergeOptions(Vue.options, {
      apolloProvider: new VueApollo({})
    });

    Vue.use(repairComponents);

    Vue.component('repair-map', RepairMap);
    Vue.component('ordp-map', OrdpMap);

    i18nInstance = options.i18n || i18n;

    i18nInstance.mergeLocaleMessage('de', messages.de);
    i18nInstance.mergeLocaleMessage('en', messages.en);
    i18nInstance.mergeLocaleMessage('fr', messages.fr);
    i18nInstance.mergeLocaleMessage('nl', messages.nl);

    Vue.prototype.$localizeField = (field) => field[i18nInstance.locale.split('-')[0]] || field.default;
  },
};

export { i18nInstance as i18n };

export default Plugin;

if (isBrowser && window.Vue) {
  window.Vue.use(Plugin);
}
