<template>
  <r-loader v-if="isLoading"/>
  <repair-map v-else v-bind="settings"/>
</template>

<script>
import RepairMap from './RepairMap.vue';
import qs from 'qs';

import 'iframe-resizer/js/iframeResizer.contentWindow.min.js';

const qsOptions = {
  arrayFormat: 'comma',
};

export default {
  components: {
    RepairMap,
  },

  data: function () {
    return {
      isLoading: true,
      settings: {
        type: process.env.VUE_APP_REPAIR_MAP_SOURCE,
        useGeolocation: undefined,
        defaultCenter: undefined,
        defaultZoom: undefined,
        locale: undefined,
        itemsPerPage: undefined,
        showFilterButtons: undefined,
        mapboxAccessToken: undefined,
        apiBaseUrl: undefined,
      },
    };
  },

  async mounted() {
    const params = qs.parse(location.search.substr(1), qsOptions);

    if (params.type) {
      this.settings.type = params.type;
    }

    if (params.use_geolocation) {
      this.settings.useGeolocation = params.use_geolocation;
    }

    if (params.center) {
      if (Array.isArray(params.center)) {
        this.settings.defaultCenter = params.center;
      } else {
        this.settings.defaultCenter = params.center.split(',');
      }
    }

    if (params.zoom) {
      this.settings.defaultZoom = params.zoom;
    }

    if (params.locale || params.lang) {
      this.settings.locale = params.locale || params.lang;
    }

    if (params.items_per_page) {
      this.settings.itemsPerPage = params.items_per_page;
    }

    if (params.show_filter_buttons) {
      this.settings.showFilterButtons = params.show_filter_buttons;
    }

    if (params.mapboxAccessToken || params.mapbox_access_token) {
      this.settings.mapboxAccessToken = params.mapboxAccessToken || params.mapbox_access_token;
    }

    if (params.api_base_url) {
      this.settings.apiBaseUrl = params.api_base_url;
    }

    this.isLoading = false;
  },
};
</script>
