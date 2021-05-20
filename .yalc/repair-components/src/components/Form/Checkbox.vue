<template>
  <div>
    <label :for="htmlId">
      <input type="checkbox" :id="htmlId" :value="value" :checked="isChecked" @change="onChange" />
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
  name: 'r-checkbox',
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
      type: String,
      required: true,
    },
    modelValue: {
      type: [Array, Boolean],
      default: () => false,
    },
    trueValue: {
      default: () => true,
    },
    falseValue: {
      default: () => false,
    },
  },
  computed: {
    isChecked() {
      const { modelValue, value } = this;

      if (Array.isArray(modelValue)) {
        return modelValue.includes(value);
      }

      return modelValue === value;
    },
  },
  methods: {
    onChange(event) {
      const { modelValue, value } = this;
      const isChecked = event.target.checked;
      let newValue;
      if (Array.isArray(modelValue)) {
        newValue = [...modelValue];
        if (isChecked) {
          newValue.push(value);
        } else {
          newValue.splice(newValue.indexOf(value), 1);
        }
      } else {
        newValue = isChecked ? this.trueValue : this.falseValue;
      }

      this.$emit('update:modelValue', newValue);
    },
  },
};
</script>
