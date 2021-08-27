import Vue from 'vue';
import App from './App.vue';

import plugin from '../lib/main';

Vue.use(plugin);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
