<template>
  <svg
    viewBox="0 0 24 24"
    class="inline-block align-middle leading-none fill-current"
    :style="{ width: size, height: size }"
  >
    <path v-show="path" :d="path" :fill="fill" />
  </svg>
</template>

<script>
export default {
  inject: ['$icons'],
  name: 'r-icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: () => '1em',
    },
    fill: {
      type: String,
      default: () => null,
    },
  },
  computed: {
    path() {
      return this.$icons && this.$icons[this.name];
    },
  },
};
</script>
