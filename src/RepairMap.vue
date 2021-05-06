<template>
  <r-app>
    <r-section v-if="showFilterButtons">
      <h2 class="text-h2 text-secondary">Find interesting repair locations in your region.</h2>
      <div class="font-bold mb-3">Search by:</div>
      <div class="flex flex-wrap -m-2">
        <r-button
          color="secondary"
          :class="{ 'bg-secondary-dark': isFilterActive('TYPE') }"
          @click="toggleFilter('TYPE')"
          class="m-2"
        >
          Type
          <r-icon :name="isFilterActive('TYPE') ? 'mdiChevronUp' : 'mdiChevronDown'" />
        </r-button>
        <r-button
          color="secondary"
          :class="{ 'bg-secondary-dark': isFilterActive('CATEGORY') }"
          @click="toggleFilter('CATEGORY')"
          class="m-2"
        >
          Category
          <r-icon :name="isFilterActive('CATEGORY') ? 'mdiChevronUp' : 'mdiChevronDown'" />
        </r-button>
        <r-button
          color="secondary"
          :class="{ 'bg-secondary-dark': isFilterActive('LOCATION') }"
          @click="toggleFilter('LOCATION')"
          class="m-2"
        >
          Location
          <r-icon :name="isFilterActive('LOCATION') ? 'mdiChevronUp' : 'mdiChevronDown'" />
        </r-button>
      </div>
    </r-section>
    <r-section v-if="showActiveFilters" color="secondary">
      <h3 class="text-h3 text-white">Active filters:</h3>
      <div v-if="filters.organisation_types.length" class="flex flex-wrap align-middle -my-2 -mx-1 mb-2">
        <div class="my-2 ml-1 mr-2">Type:</div>
        <template v-for="organisationType in organisationTypes" :key="organisationType.id">
          <button
            v-if="filters.organisation_types.includes(organisationType.id)"
            color="secondary"
            contrast
            class="my-2 mx-1 p-1 leading-none text-small font-base bg-white text-secondary border-0 font-bold cursor-pointer rounded hover:bg-secondary-dark hover:text-white transition-colors"
            @click="clearFilter('organisation_types', organisationType.id)"
          >
            <span>{{ i18n.localizeField(organisationType.name) }}</span>
            <r-icon name="mdiClose" class="ml-1" />
          </button>
        </template>
      </div>
      <div v-if="filters.product_categories.length" class="flex flex-wrap align-middle -my-2 -mx-1 mb-2">
        <div class="my-2 ml-1 mr-2">Category:</div>
        <template v-for="category in categories" :key="category.id">
          <button
            v-if="filters.product_categories.includes(category.id)"
            class="my-2 mx-1 p-1 leading-none text-small font-base bg-white text-secondary border-0 font-bold cursor-pointer rounded hover:bg-secondary-dark hover:text-white transition-colors"
            @click="clearFilter('product_categories', category.id)"
          >
            {{ i18n.localizeField(category.name) }}
            <r-icon name="mdiClose" />
          </button>
        </template>
      </div>
      <div v-if="filters.location" class="flex flex-wrap align-middle -m-1">
        <template v-for="organisationType in organisationTypes" :key="organisationType.id">
          <r-button
            v-if="filters.organisation_types.includes(organisationType.id)"
            color="secondary"
            contrast
            size="small"
            class="m-1"
            @click="clearFilter('organisation_types', organisationType.id)"
          >
            {{ i18n.localizeField(organisationType.name) }}
            <r-icon name="mdiClose" />
          </r-button>
        </template>
      </div>
    </r-section>
    <section-filter
      v-else-if="isFilterActive('TYPE')"
      :title="i18n.t('filter.type.title')"
      :text="i18n.t('filter.type.text')"
      @submit="onFilterSubmit"
      @close="toggleFilter(null)"
    >
      <r-checkbox
        v-for="(organisationType, key) in organisationTypes"
        :key="key"
        v-model="filters.organisation_types"
        :value="organisationType.id"
        :label="i18n.localizeField(organisationType.name)"
      >
        <template #label>
          <span>
            <r-icon name="mdiMapMarker" :fill="categoryColors[organisationType.code]" class="mr-1" />
            <span>{{ i18n.localizeField(organisationType.name) }}</span>
          </span>
        </template>
      </r-checkbox>
    </section-filter>
    <section-filter
      v-else-if="isFilterActive('CATEGORY')"
      :title="i18n.t('filter.category.title')"
      :text="i18n.t('filter.category.text')"
      @submit="onFilterSubmit"
      @close="toggleFilter(null)"
    >
      <div class="flex flex-wrap -my-2">
        <div
          v-for="categoryCode in [
            'kitchen-and-household-item',
            'computers-and-home-office',
            'electronic-gadgets',
            'home-entertainment',
          ]"
          class="py-2 w-100 sm:w-1/2 md:w-1/3 lg:w-1/4"
        >
          <h4 class="text-white mb-1">{{ i18n.localizeField(categoryGroups[categoryCode].name) }}</h4>
          <div v-for="(category, key) in categoryGroups[categoryCode].data" :key="key">
            <input
              type="checkbox"
              v-model="filters.product_categories"
              :value="category.id"
              :id="`filter-category-${category.id}`"
              class="mr-1"
            />
            <label :for="`filter-category-${category.id}`">{{ i18n.localizeField(category.name) }}</label>
          </div>
        </div>
      </div>
    </section-filter>
    <section-filter
      v-else-if="isFilterActive('LOCATION') && showLocationFilter"
      :title="i18n.t('filter.location.title')"
      @submit="submitLocationFilter"
      @close="toggleFilter(null)"
    >
      <!-- {{ mapboxAccessToken }}
      <r-mapbox-search v-if="mapboxAccessToken" :access-token="mapboxAccessToken" label="Locatie" /> -->
      <div v-for="(location, index) in defaultLocations">
        <r-radio v-model="filters.bbox" :value="location.bbox" :label="location.name" />
      </div>
    </section-filter>
    <r-section size="0" ref="pageContainer">
      <div class="flex -mx-2 relative items-start">
        <div class="w-1/2 px-2">
          <p class="my-5">{{ i18n.t('locations.results.n', { n: locationTotal }) }}</p>
          <div class="my-5">
            <template v-for="(location, index) in locations" :key="location.id">
              <card-location
                v-if="isCurrentPage(index)"
                :location="location"
                :is-active="activeLocation === location.id"
                @click="onLocationClick(location)"
              >
                <template #locationTitle="slotProps">
                  <slot name="locationTitle" v-bind="slotProps" />
                </template>
              </card-location>
            </template>
          </div>
          <r-pagination v-model="currentPage" :pages="totalPages"></r-pagination>
        </div>
        <div class="w-1/2 px-2 sticky top-0">
          <div class="h-screen" ref="map"></div>
          <!-- <r-button v-show="showRefreshButton" class="absolute top-1 right-1 z-[999]">Search again</r-button> -->
          <div v-show="false" ref="popup">
            <h3 class="text-h3 text-primary">Maakbaar Leuven</h3>
            <strong class="font-semibold">Repair café</strong>
          </div>
        </div>
      </div>
    </r-section>
    <r-section>
      <div class="bg-gray-100 p-10 rounded-3xl">
        <h2 class="text-h2 text-secondary">A repair initiative missing on the map?</h2>
        <p class="md:w-8/12">
          Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Curabitur blandit tempus
          porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <r-button color="secondary" icon-after="mdiChevronRight">
          Suggest a repair initiative that is not on the map
        </r-button>
      </div>
    </r-section>
  </r-app>
</template>

<script>
import { ref, readonly, provide } from 'vue';

import {
  RApp,
  RButton,
  RCheckbox,
  RIcon,
  RInput,
  RMapboxSearch,
  RPagination,
  RRadio,
  RSection,
} from 'repair-components';

import * as icons from 'repair-components/icons';
import SectionFilter from './components/SectionFilter.vue';
import CardLocation from './components/CardLocation.vue';

import Leaflet from 'leaflet';
import axios from 'axios';
import qs from 'qs';

import i18n from './i18n';
import categoryColors from './constants/categoryColors';

import './assets/css/index.css';
import 'leaflet/dist/leaflet.css';

const qsOptions = {
  arrayFormat: 'comma',
};

export default {
  components: {
    CardLocation,
    SectionFilter,
    RApp,
    RButton,
    RCheckbox,
    RIcon,
    RInput,
    RMapboxSearch,
    RPagination,
    RRadio,
    RSection,
  },
  props: {
    filter: {
      type: String,
      default: () => null,
    },
    defaultLocations: {
      type: Array,
      default: () => [],
    },
    locale: {
      type: String,
      default: () => null,
    },
    mapboxAccessToken: {
      type: String,
      default: () => null,
    },
    itemsPerPage: {
      type: Number,
      default: () => 10,
    },
    showFilterButtons: {
      type: Boolean,
      default: () => true,
    },
  },
  data: () => ({
    locations: [],
    locationTotal: 0,
    organisationTypes: [],
    categories: [],
    activeLocation: null,
    showRefreshButton: false,
    activeFilter: null,
    filters: {
      organisation_types: [],
      product_categories: [],
      location: null,
    },
    currentPage: 1,
    mapboxSearch: '',
  }),
  computed: {
    categoryGroups() {
      const categoryGroups = {};

      this.categories.forEach((category) => {
        if (!category.parent_category) return;

        if (!categoryGroups.hasOwnProperty(category.parent_category.code)) {
          categoryGroups[category.parent_category.code] = {
            ...category.parent_category,
            data: [],
          };
        }

        categoryGroups[category.parent_category.code].data.push(category);
      });

      return categoryGroups;
    },
    showLocationFilter() {
      return this.mapboxAccessToken || this.defaultLocations.length;
    },
    showActiveFilters() {
      const { filters, isFilterActive } = this;

      return (
        isFilterActive(null) &&
        (filters.organisation_types.length || filters.product_categories.length || filters.location)
      );
    },
    defaultQuery() {
      return {
        locales: [this.$locale],
      };
    },
    totalPages() {
      return Math.ceil(this.locations.length / 10);
    },
  },
  setup(props) {
    if (props.locale) {
      i18n.setLocale(props.locale);
    }

    provide('i18n', ref(i18n));
    provide('icons', ref(icons));
    provide('categoryColors', readonly(categoryColors));

    return {
      i18n,
      icons,
      categoryColors,
    };
  },
  watch: {
    locations() {
      this.updateMarkers();
    },
    currentPage() {
      this.$refs.pageContainer.$el.scrollIntoView({
        behavior: 'smooth',
      });
    },
  },
  created() {
    this.activeFilter = this.filter;
  },
  mounted() {
    this.renderMap();
    this.askLocation();
    this.fetchLocations();
    this.fetchOrganisationTypes();
    this.fetchCategories();
  },
  methods: {
    askLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.map.setView(new Leaflet.LatLng(position.coords.latitude, position.coords.longitude));
      });
    },
    renderMap() {
      this.map = Leaflet.map(this.$refs.map).setView([50, 0], 14);

      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      this.map.on('moveend', () => {
        this.showRefreshButton = true;
      });
    },
    updateMarkers() {
      this.locations.forEach((location) => {
        if (location.geometry.latitude && location.geometry.latitude) {
          const marker = Leaflet.marker([location.geometry.longitude, location.geometry.latitude], {}).addTo(this.map);

          marker.bindPopup(this.$refs.popup);
        }
      });
    },
    fitBounds(location) {
      this.map.fitBounds([location.bbox.slice(0, 2), location.bbox.slice(2)]);
    },
    async fetchLocations() {
      const { filters, defaultQuery } = this;
      const mapBounds = this.map.getBounds();
      const bbox = [mapBounds.getSouth(), mapBounds.getWest(), mapBounds.getNorth(), mapBounds.getSouth()];

      const query = qs.stringify(
        {
          ...defaultQuery,
          ...filters,
          // bbox,
          per_page: 30,
        },
        qsOptions
      );

      const {
        data: {
          data,
          meta: { total },
        },
      } = await axios.get(`http://repmap.staging.statik.be/api/v1/locations?${query}`);

      this.locationTotal = total;
      this.locations = data;
    },
    async fetchOrganisationTypes() {
      const query = qs.stringify(this.defaultQuery, qsOptions);

      const {
        data: { data },
      } = await axios.get(`http://repmap.staging.statik.be/api/v1/organisation_types?${query}`);

      this.organisationTypes = data;
    },
    async fetchCategories() {
      const query = qs.stringify(this.defaultQuery, qsOptions);

      const {
        data: { data },
      } = await axios.get(`http://repmap.staging.statik.be/api/v1/product_categories?${query}`);

      this.categories = data;
    },
    isFilterActive(filter = null) {
      return this.activeFilter === filter;
    },
    toggleFilter(filter) {
      this.activeFilter = this.activeFilter === filter ? null : filter;

      if (this.activeFilter === null) {
        this.$emit('filter-close');
      }
    },
    clearFilter(filter, value) {
      this.filters[filter] = this.filters[filter].filter((item) => item !== value);
      this.fetchLocations();
    },
    submitLocationFilter() {
      const {
        filters: { bbox },
      } = this;

      if (bbox) {
        this.map.fitBounds([
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ]);
      }

      this.fetchLocations();
    },
    isCurrentPage(index) {
      const indexMin = (this.currentPage - 1) * this.itemsPerPage;
      const indexMax = this.currentPage * this.itemsPerPage;

      return index >= indexMin && index < indexMax;
    },
    onLocationClick(location) {
      if (this.activeLocation === location.id) {
        this.activeLocation = null;
      } else {
        this.activeLocation = location.id;
      }
    },
    onFilterSubmit() {
      this.toggleFilter(null);
      this.fetchLocations();
    },
  },
};
</script>
