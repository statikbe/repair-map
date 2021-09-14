import Vue from 'vue';
import { i18n } from '@statikbe/repair-components';

import App from './App.vue';
import plugin from '../lib/main';

Vue.use(plugin);

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount('#app');
