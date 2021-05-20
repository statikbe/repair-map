<template>
  <r-form-field v-bind="{ label }">
    <template #default="{}">
      <v-multiselect
        v-model="selected"
        :options="options"
        :loading="isLoading"
        :placeholder="null"
        @search-change="onSearchChange"
      >
        <template #option="{ option }">
          <div>{{ option.display_name }}</div>
        </template>
      </v-multiselect>
    </template>
  </r-form-field>
</template>

<script>
import axios from 'axios';
import debounce from 'lodash.debounce';
import VMultiselect from 'vue-multiselect';

import { RFormField } from '.';

import 'vue-multiselect/dist/vue-multiselect.min.css';

export default {
  name: 'r-form-location',
  components: {
    RFormField,
    VMultiselect,
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: () => '',
    },
  },
  data: () => ({
    options: [],
    selected: null,
    isLoading: false,
  }),
  methods: {
    onSearchChange: debounce((keyword) => {
      this.isLoading = true;

      axios.get(`https://nominatim.openstreetmap.org/search?q=${keyword}`).then((options) => {
        this.options = options.map(({ category, importance }) => category === 'boundary' && importance > 0.3);
        this.isLoading = false;
      });
    }, 500),
  },
};
</script>
