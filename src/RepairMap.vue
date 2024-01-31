<template>
  <ordp-map
      v-if="$props.type === 'ordp'"
      v-bind="$props"
  />
  <repair-connects-map
    v-else
    v-bind="$props"
  />

</template>

<script>
import RepairConnectsMap from './RepairConnectsMap.vue';
import OrdpMap from './OrdpMap.vue';

const defaultCenter = [50.87959, 4.70093];

export default {
  name: 'repair-map',
  components: {
    RepairConnectsMap,
    OrdpMap,
  },

  props: {
    embed: {
      type: Boolean,
      default: () => false,
    },
    type: {
      type: String,
      default: () => 'ordp',
    },
    filter: {
      type: String,
      default: () => undefined,
    },
    useGeolocation: {
      type: Boolean,
      default: () => true,
    },
    defaultCenter: {
      type: Array,
      default: () => defaultCenter,
    },
    defaultZoom: {
      type: Number,
      default: () => 14,
    },
    locale: {
      type: String,
      default: () => document.documentElement.lang || 'en',
    },
    itemsPerPage: {
      type: Number,
      default: () => 10,
    },
    showFilterButtons: {
      type: Boolean,
      default: () => true,
    },
    mapboxAccessToken: {
      type: String,
      default: () => undefined,
    },
    apiBaseUrl: {
      type: String,
      default: () => undefined,
    },
  },
};
</script>
