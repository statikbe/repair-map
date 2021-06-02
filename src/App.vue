<template>
  <repair-map :filterLocations="filterLocations" />
</template>

<script>
// import { RIcon } from 'repair-components';
import RepairMap from './RepairMap.vue';

export default {
  components: {
    // RButton,
    // RIcon,
    // RSection,
    RepairMap,
  },
  computed: {
    filterLocations() {
      return [
        {
          name: 'Leuven',
          bbox: [50.824177, 4.640198, 50.943362, 4.772457],
        },
        {
          name: 'New York',
          bbox: [40.7128, 74.006],
        },
      ];
    },
  },
};
</script>
