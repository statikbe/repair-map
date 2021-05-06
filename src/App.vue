<template>
  <repair-map
    locale="en"
    mapbox-access-token="pk.eyJ1IjoiZHVwb250bmllbHMiLCJhIjoiY2tsdXoyNDNvMDk5MzJ3bXdmMnNndWFqcSJ9.1uvdTrAsxKX6sARWZDA93A"
    :default-locations="defaultLocations"
    :show-filter-buttons="true"
    @filter-close="activeFilter = null"
  >
    <template #locationTitle="{ name, id, defaultClass }">
      <a :href="`https://my-custom-url.com/location/${id}`" :class="defaultClass">
        <span>{{ name }}</span>
        <r-icon name="mdiChevronRight" />
      </a>
    </template>
  </repair-map>
</template>

<script>
import { RButton, RIcon, RSection } from 'repair-components';
import RepairMap from './RepairMap.vue';

export default {
  components: {
    RButton,
    RIcon,
    RSection,
    RepairMap,
  },
  data: () => ({
    activeFilter: 'TYPE',
  }),
  computed: {
    defaultLocations() {
      return [
        {
          name: 'Leuven',
          bbox: [50.824177, 4.640198, 50.943362, 4.772457],
        },
      ];
    },
  },
};
</script>
