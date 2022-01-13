<template>
  <div
    class="p-5 mb-3 transition-colors bg-gray-100 border-4 border-solid rounded-3xl font-base"
    :class="{
      'border-primary ': isActive,
      'border-gray-100': !isActive,
      'hover:border-gray-200 hover:bg-gray-200 cursor-pointer': !isActive && !extended,
      'shadow-md': extended,
    }"
    tabindex="0"
    @keydown.enter="$emit('click')"
  >
    <h3 class="inline-flex items-center text-h3 text-primary">
      <slot
        name="locationTitle"
        v-bind="{
          location,
          locationTitle,
          defaultClass: '!text-primary hover:!text-primary-dark transition-colors no-underline',
        }"
      >
        {{ locationTitle }}
        <r-icon name="mdiChevronRight" />
      </slot>
    </h3>
    <div v-if="location.organisation_type" class="font-semibold text-small">
      <r-icon name="mdiMapMarker" :fill="categoryColors[location.organisation_type.code]" class="mr-1" />
      <span>{{ $localizeField(location.organisation_type.name) }}</span>
    </div>
    <div v-if="location.product_categories" class="mt-4">
      <div class="flex flex-wrap -m-1">
        <span
          v-for="category in location.product_categories.slice(0, 4)"
          :key="category.id"
          class="px-2 m-1 font-bold bg-white rounded-md text-tiny text-secondary"
        >
          {{ $localizeField(category.name) }}
        </span>
        <span
          v-if="location.product_categories.length > 4"
          class="px-2 m-1 font-bold bg-white rounded-md text-tiny text-secondary"
          >+ {{ location.product_categories.length - 4 }} {{ $t('card_location_other') }}</span
        >
      </div>
      <div v-if="extended" class="mt-3 leading-none text-tiny">
        <div class="flex">
          <r-icon name="mdiMapMarker" size="1.5em" class="flex-grow-0 flex-shrink-0 mr-1 leading-none text-primary" />
          <div class="leading-normal truncate">
            {{ location.address_formatted }}
          </div>
        </div>
        <div v-for="(contacts, type) in location.contacts" :key="type" class="flex mt-1">
          <template v-if="type !== 'google'">
            <r-icon
              :name="`contact_${type}`"
              size="1.5em"
              class="flex-grow-0 flex-shrink-0 mr-1 leading-none text-primary"
            />
            <div class="leading-normal truncate">
              <div v-for="(contact, key) in contacts" :key="key">
                <a :href="contact.value" target="_blank" rel="noopener noreferrer">{{ contact.name }}</a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RIcon } from '@statikbe/repair-components';
import categoryColors from '../constants/categoryColors';

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
      default: () => false,
    },
    extended: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    categoryColors() {
      return categoryColors;
    },
    locationTitle() {
      return this.$localizeField(this.location.name) || this.$t('location_name_fallback');
    },
  },
};
</script>
