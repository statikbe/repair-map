<template>
  <r-section color="secondary" class="relative">
    <h2 class="text-h3 text-white">{{ title }}</h2>
    <p v-if="text" class="mb-4 md:w-8/12">
      {{ text }}
    </p>
    <slot />
    <r-button color="secondary" icon-after="mdiChevronRight" contrast class="mt-5" @click.native="$emit('submit')">
      {{ $i18n.t('filter.submit') }}
    </r-button>
    <button
      class="absolute right-3 top-3 inline-block p-2 rounded-full border-0 text-huge leading-0 cursor-pointer bg-white text-black transition-colors"
      @click="$emit('close')"
    >
      <r-icon name="mdiChevronUp" class="block" />
    </button>
  </r-section>
</template>

<script>
import { RButton, RIcon, RSection } from 'repair-components';

import i18n from '../i18n';

export default {
  inject: ['$i18n', '$icons', 'categoryColors'],
  components: {
    RButton,
    RIcon,
    RSection,
  },
  props: {
    title: {
      type: String,
      default: () => null,
    },
    text: {
      type: String,
      default: () => null,
    },
  },
  created() {
    this.$i18n = i18n;
  },
};
</script>

<style lang="css">
.leading-0 {
  line-height: 0 !important;
}
</style>
