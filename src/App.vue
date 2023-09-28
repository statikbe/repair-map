<template>
  <repair-map embed />
</template>

<script>
export default {
  components: {
    'repair-map': () => {
      return process.env.VUE_APP_REPAIR_MAP_SOURCE === 'repair' ? import('./RepairMap.vue') : import('./OrdpMap.vue');
    }
  },
};
</script>
