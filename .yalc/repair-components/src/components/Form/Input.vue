<template>
  <r-form-field v-bind="{ label }">
    <template #default="{ id }">
      <input
        :id="id"
        :value="modelValue"
        type="text"
        class="text-small block w-full px-3 py-2 rounded border-gray-300 border-solid border bg-white"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </template>
  </r-form-field>
</template>

<script>
import { RFormField } from '.';

export default {
  name: 'r-input',
  components: {
    RFormField,
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: {
      type: String,
      default: () => '',
    },
    label: {
      type: String,
      required: true,
    },
  },
};
</script>
