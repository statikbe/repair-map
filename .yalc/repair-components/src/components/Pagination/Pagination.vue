<template>
  <div v-if="pages > 1" class="text-center">
    <div class="inline-flex align-middle -m-1">
      <button
        type="button"
        class="m-1 px-1 py-0 text-button border-0 bg-white bg-opacity-0 font-base leading-[40px] min-w-[40px] cursor-pointer transition-colors"
        :class="{
          'text-gray-200': isFirstPage,
          'text-primary hover:text-primary-dark': !isFirstPage,
        }"
        :disabled="isFirstPage"
        @click="$emit('update:modelValue', modelValue - 1)"
      >
        <r-icon name="mdiChevronLeft" />
      </button>
      <button
        v-for="page in pages"
        type="button"
        class="m-1 px-1 py-0 text-button border-0 font-bold font-base leading-[40px] min-w-[40px] cursor-pointer transition-colors"
        :class="{
          'bg-primary text-primary-contrast': isActive(page),
          'bg-gray-100 text-primary hover:bg-gray-200': !isActive(page),
        }"
        :key="page"
        @click="$emit('update:modelValue', page)"
      >
        {{ page }}
      </button>
      <button
        type="button"
        class="m-1 px-1 py-0 text-button border-0 bg-white bg-opacity-0 font-base leading-[40px] min-w-[40px] cursor-pointer transition-colors"
        :class="{
          'text-gray-200': isLastPage,
          'text-primary hover:text-primary-dark': !isLastPage,
        }"
        :disabled="isLastPage"
        @click="$emit('update:modelValue', modelValue + 1)"
      >
        <r-icon name="mdiChevronRight" />
      </button>
    </div>
  </div>
</template>

<script>
import { RIcon } from '..';

export default {
  name: 'r-pagination',
  components: {
    RIcon,
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: {
      type: Number,
      default: () => 1,
    },
    pages: {
      type: Number,
      default: () => 1,
    },
  },
  computed: {
    isFirstPage() {
      return this.modelValue === 1;
    },
    isLastPage() {
      return this.modelValue === this.pages;
    },
  },
  methods: {
    isActive(page) {
      return this.modelValue === page;
    },
  },
};
</script>
