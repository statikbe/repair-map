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
          defaultClass: '!text-primary hover:!text-primary-dark transition-colors hover:no-underline',
        }"
      >
        {{ locationTitle }}
      </slot>
      <r-icon name="mdiChevronRight" />
    </h3>
    <div v-if="location.organisationTypeCode" class="font-semibold text-small">
      <r-icon name="mdiMapMarker" :fill="categoryColors[location.organisationTypeCode]" class="mr-1" />
      <span>{{ $t(`organisation_type_${location.organisationTypeCode}_label`) }}</span>
    </div>
    <!--<div v-if="location.product_categories" class="mt-4">
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
    </div>-->
    <div class="mt-3 space-y-2 leading-none text-tiny">
      <div class="flex">
        <r-icon name="mdiMapMarker" size="1.5em" class="flex-grow-0 flex-shrink-0 mr-1 leading-none text-primary" />
        <div class="leading-normal truncate">
          {{ location.address.formatted }}
        </div>
      </div>

      <div v-for="(website, key) in location.contactsWebsite" :key="key + 'web'" class="flex">
        <r-icon name="contact_website" size="1.5em" class="flex-grow-0 flex-shrink-0 mr-1 leading-none text-primary" />
        <div class="leading-normal truncate">
          <a :href="website" target="_blank" rel="noopener noreferrer" class="text-black hover:no-underline">{{
            website
          }}</a>
        </div>
      </div>

      <div v-for="(email, key) in location.contactsEmail" :key="key + 'email'" class="flex">
        <r-icon name="contact_email" size="1.5em" class="flex-grow-0 flex-shrink-0 mr-1 leading-none text-primary" />
        <div class="leading-normal truncate">
          <a :href="`mailto:${email}`" class="text-black hover:no-underline">{{ email }}</a>
        </div>
      </div>

      <div v-for="(phone, key) in location.contactsPhone" :key="key + 'phone'" class="flex">
        <r-icon name="contact_phone" size="1.5em" class="flex-grow-0 flex-shrink-0 mr-1 leading-none text-primary" />
        <div class="leading-normal truncate">
          <a :href="`tel:${phone}`" class="text-black hover:no-underline">{{ phone }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RIcon } from '@statikbe/repair-components';
import categoryColors from '../../constants/categoryColors';

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
      return this.location.name || this.$t('location_name_fallback');
    },
  },
};
</script>
