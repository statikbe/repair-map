import Vue from 'vue';
import App from './App.vue';

import ComponentLibrary from '../lib/main';

import './assets/css/app.css';
import './assets/css/index.css';

Vue.use(ComponentLibrary);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
