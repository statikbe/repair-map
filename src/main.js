import Vue from 'vue';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';
import { i18n } from '@statikbe/repair-components';

import App from './App.vue';
import plugin from '../lib/main';

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: process.env.REPAIR_MAP_GRAPHQL_HTTP || 'https://ordp-api.vito.be/',
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(VueApollo);
Vue.use(plugin);

new Vue({
  i18n,
  apolloProvider,
  render: (h) => h(App),
}).$mount('#app');
