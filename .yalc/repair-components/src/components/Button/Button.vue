<template>
  <button
    type="button"
    class="inline-flex align-center rounded-full border-0 font-base font-bold text-button tracking-wider cursor-pointer transition-colors"
    :class="dynamicClasses"
  >
    <r-icon v-if="iconBefore" :name="iconBefore" class="mr-1" />
    <slot />
    <r-icon v-if="iconAfter" :name="iconAfter" class="mr-1" />
  </button>
</template>

<script>
import { RIcon } from '../Icon';

export default {
  name: 'r-button',
  components: {
    RIcon,
  },
  props: {
    color: {
      type: String,
      default: () => 'primary',
    },
    size: {
      type: String,
      default: () => 'DEFAULT',
    },
    contrast: {
      type: Boolean,
      default: () => false,
    },
    iconBefore: {
      type: String,
      default: () => null,
    },
    iconAfter: {
      type: String,
      default: () => null,
    },
  },
  computed: {
    dynamicClasses() {
      const { color, contrast, size } = this;

      let classes;

      if (!contrast) {
        classes = `bg-${color} text-${color}-contrast hover:bg-${color}-dark`;
      } else {
        classes = `bg-${color}-contrast text-${color} hover:bg-${color}-dark hover:text-${color}-contrast`;
      }

      classes += {
        small: ' px-3 py-1 text-small',
        DEFAULT: ' px-4 py-2 text-button',
        large: ' px-5 py-3 text-large',
      }[size];

      return classes;
    },
  },
};
</script>
