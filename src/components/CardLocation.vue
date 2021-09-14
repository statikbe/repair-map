<template>
  <div
    class="p-5 rounded-3xl bg-gray-100 transition-colors mb-3 border-4 border-solid font-base"
    :class="{
      'border-primary ': isActive,
      'border-gray-100': !isActive,
      'hover:border-gray-200 hover:bg-gray-200 cursor-pointer': !isActive && !extended,
      'shadow-md': extended,
    }"
    tabindex="0"
    @keydown.enter="$emit('click')"
  >
    <h3 class="text-h3 text-primary inline-flex items-center">
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
          v-for="category in location.product_categories"
          :key="category.id"
          class="m-1 px-2 bg-white text-tiny text-secondary font-bold rounded-md"
        >
          {{ $localizeField(category.name) }}
        </span>
      </div>
      <div v-if="extended" class="text-tiny leading-none mt-3">
        <div class="flex">
          <r-icon name="mdiMapMarker" size="1.5em" class="leading-none text-primary mr-1 flex-shrink-0 flex-grow-0" />
          <div class="leading-normal truncate">
            {{ location.address.street }} {{ location.address.number }}, {{ location.address.postal_code }}
            {{ location.address.city }}, {{ location.address.country }}
          </div>
        </div>
        <div v-for="(contacts, type) in location.contacts" :key="type" class="flex mt-1">
          <r-icon
            :name="`contact_${type}`"
            size="1.5em"
            class="leading-none text-primary mr-1 flex-shrink-0 flex-grow-0"
          />
          <div class="leading-normal truncate">
            <div v-for="(contact, key) in contacts" :key="key">
              <a :href="contact.value" target="_blank" rel="noopener noreferrer">{{ contact.name }}</a>
            </div>
          </div>
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
