<template>
  <repair-map embed />
</template>

<script>
export default {
  components: {
    'repair-map': () =>
      process.env.REPAIR_MAP_SOURCE === 'repair' ? import('./RepairMap.vue') : import('./OrdpMap.vue'),
  },
};
</script>
