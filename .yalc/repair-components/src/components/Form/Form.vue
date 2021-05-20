<template>
  <form action="">
    <slot name="default"></slot>
  </form>
</template>

<script>
import uuid from '../../mixins/uuid';

export default {
  name: 'r-form',
  mixins: [uuid],
  computed: {
    id() {
      return `form-field-${this.uuid}`;
    },
  },
};
</script>

<style></style>
