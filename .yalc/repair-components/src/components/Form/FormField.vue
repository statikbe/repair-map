<template>
  <div class="mb-4">
    <slot name="label" v-bind="{ id, resettable }">
      <div class="mb-1">
        <label :for="id" class="text-base font-medium">{{ label }}</label>
        <span v-if="resettable" class="text-small">
          (<a href="javascript:void(0)" class="text-gray-700" @click="$emit('reset')">reset</a>)
        </span>
      </div>
    </slot>
    <slot name="default" v-bind="{ id }"></slot>
    <div v-if="errors" class="text-tiny text-error font-bold mt-1" v-html="formattedErrors"></div>
  </div>
</template>

<script>
import uuid from '../../mixins/uuid';

export default {
  name: 'r-form-field',
  mixins: [uuid],
  props: {
    label: {
      type: String,
      required: true,
    },
    errors: {
      type: [String, Array],
      default: () => '',
    },
    resettable: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    id() {
      return `form-field-${this.uuid}`;
    },
    formattedErrors() {
      return Array.isArray(this.errors) ? this.errors.join('<br/>') : this.errors;
    },
  },
};
</script>

<style></style>
