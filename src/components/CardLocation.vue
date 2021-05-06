<template>
  <div
    class="p-5 rounded-3xl bg-gray-100 transition-colors cursor-pointer mb-3 border-4 border-solid"
    :class="{
      'border-primary ': isActive,
      'border-gray-100 hover:border-gray-200 hover:bg-gray-200': !isActive,
    }"
    tabindex="0"
    @click.native="onChange"
    @keydown.enter="$emit('click')"
  >
    <h3 class="text-h3 text-primary inline-block">
      <slot
        name="locationTitle"
        v-bind="{
          name: i18n.localizeField(location.name),
          id: location.id,
          defaultClass: 'text-primary no-underline hover:text-primary-dark transition-colors',
        }"
      >
        {{ i18n.localizeField(location.name) }}
        <r-icon name="mdiChevronRight" />
      </slot>
    </h3>
    <div class="font-semibold text-small">
      <r-icon name="mdiMapMarker" :fill="categoryColors[location.organisation_type.code]" class="mr-1" />
      <span>{{ i18n.localizeField(location.organisation_type.name) }}</span>
    </div>
    <div v-if="location.product_categories" class="mt-4">
      <div class="flex flex-wrap -m-1">
        <span
          v-for="category in location.product_categories"
          :key="category.id"
          class="m-1 px-2 bg-white text-tiny text-secondary font-bold rounded-md"
        >
          {{ i18n.localizeField(category.name) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';
import { RIcon } from 'repair-components';

export default {
  components: {
    RIcon,
  },
  props: {
    location: {
      type: Object,
      default: () => null,
    },
    isActive: {
      type: Boolean,
      default: () => true,
    },
  },
  watch: {
    isActive(v) {
      console.log(v);
    },
  },
  setup() {
    const i18n = inject('i18n');
    const icons = inject('icons');
    const categoryColors = inject('categoryColors');

    return {
      i18n,
      icons,
      categoryColors,
    };
  },
};
</script>
