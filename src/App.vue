<template>
  <repair-map embed />
</template>

<script>
export default {
  components: {
    'repair-map': () => (process.env.VUE_APP_MAP === 'ordp' ? import('./OrdpMap.vue') : import('./RepairMap.vue')),
  },
};
</script>
