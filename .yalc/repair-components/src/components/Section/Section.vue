<template>
  <div :class="dynamicClasses">
    <r-container v-if="container">
      <slot />
    </r-container>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import { RContainer } from '..';

export default {
  name: 'r-section',
  components: {
    RContainer,
  },
  props: {
    color: {
      type: String,
      default: () => null,
    },
    size: {
      type: String,
      default: () => 'md',
    },
    container: {
      type: Boolean,
      default: () => true,
    },
  },
  computed: {
    dynamicClasses() {
      const { color, size } = this;

      const sizeClass = {
        0: 'py-0',
        sm: 'py-3',
        md: 'py-9',
        lg: 'py-12',
      }[size];

      return [sizeClass, `bg-${color} text-${color}-contrast`];
    },
  },
};
</script>
