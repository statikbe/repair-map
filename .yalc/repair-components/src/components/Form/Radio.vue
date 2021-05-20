<template>
  <div>
    <label :for="htmlId">
      <input type="radio" :id="htmlId" :value="value" :checked="isChecked" @change="onChange" />
      <slot name="label">
        <span>{{ label }}</span>
      </slot>
    </label>
  </div>
</template>

<script>
import uuid from '../../mixins/uuid';

export default {
  mixins: [uuid],
  name: 'r-radio',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
    modelValue: {
      default: () => '',
    },
  },
  computed: {
    isChecked() {
      const { modelValue, value } = this;

      return modelValue === value;
    },
  },
  methods: {
    onChange() {
      this.$emit('update:modelValue', this.value);
    },
  },
};
</script>
