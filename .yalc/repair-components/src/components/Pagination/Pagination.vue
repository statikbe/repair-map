<template>
  <div v-if="pages > 1" class="text-center">
    <div class="inline-flex items-center -m-1">
      <r-pagination-button
        class="bg-white bg-opacity-0"
        :class="{
          'text-gray-200': isFirstPage,
          'text-primary hover:text-primary-dark': !isFirstPage,
        }"
        :disabled="isFirstPage"
        @click="$emit('update:modelValue', modelValue - 1)"
      >
        <r-icon name="mdiChevronLeft" />
      </r-pagination-button>
      <r-pagination-button :is-active="isActive(1)" @click="$emit('update:modelValue', 1)">
        {{ 1 }}
      </r-pagination-button>
      <span v-if="modelValue > 4" class="mx-1"> <r-icon name="mdiDotsHorizontal" /> </span>
      <r-pagination-button
        v-for="page in visiblePages"
        :is-active="isActive(page)"
        :key="page"
        @click="$emit('update:modelValue', page)"
      >
        {{ page }}
      </r-pagination-button>
      <span v-if="modelValue < pages - 3" class="mx-1"> <r-icon name="mdiDotsHorizontal" /> </span>
      <r-pagination-button :is-active="isActive(pages)" @click="$emit('update:modelValue', pages)">
        {{ pages }}
      </r-pagination-button>
      <r-pagination-button
        class="bg-white bg-opacity-0"
        :class="{
          'text-gray-200': isLastPage,
          'text-primary hover:text-primary-dark': !isLastPage,
        }"
        :disabled="isLastPage"
        @click="$emit('update:modelValue', modelValue + 1)"
      >
        <r-icon name="mdiChevronRight" />
      </r-pagination-button>
    </div>
  </div>
</template>

<script>
import { RIcon } from '..';
import RPaginationButton from './PaginationButton';

export default {
  name: 'r-pagination',
  components: {
    RIcon,
    RPaginationButton,
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
    visiblePages() {
      const { modelValue, pages } = this;

      const pageBefore = modelValue - 1;
      const pageAfter = modelValue + 1;

      const visiblePages = [];

      if (pageBefore === 3) {
        visiblePages.push(2);
      }

      if (pageBefore > 1) {
        visiblePages.push(pageBefore);
      }

      if (modelValue > 1 && modelValue < pages) {
        visiblePages.push(modelValue);
      }

      if (pageAfter < pages) {
        visiblePages.push(pageAfter);
      }

      if (pageAfter === pages - 2) {
        visiblePages.push(pages - 1);
      }

      return visiblePages;
    },
  },
  methods: {
    isActive(page) {
      return this.modelValue === page;
    },
  },
};
</script>
