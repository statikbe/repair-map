<template>
  <repair-map
    mapbox-access-token="pk.eyJ1Ijoic3RhdGlrLWJ2YmEiLCJhIjoiY2ttZGtleTFmMWZhczJ2cWxtZHpqOHRsNiJ9.xZJJ_lxVp6d5mOTpnqn0gA"
  />
</template>

<script>
import RepairMap from './RepairMap.vue';

export default {
  components: {
    RepairMap,
  },
};
</script>
