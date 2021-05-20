<template>
  <r-app>
    <r-section v-if="showFilterButtons">
      <h2 class="text-h2 text-secondary">Find interesting repair locations in your region.</h2>
      <div class="font-bold mb-3">Search by:</div>
      <div class="flex flex-wrap -m-2">
        <r-button
          color="secondary"
          :class="{ 'bg-secondary-dark': isFilterActive('TYPE') }"
          @click.native="toggleFilter('TYPE')"
          class="m-2"
        >
          Type
          <r-icon :name="isFilterActive('TYPE') ? 'mdiChevronUp' : 'mdiChevronDown'" />
        </r-button>
        <r-button
          color="secondary"
          :class="{ 'bg-secondary-dark': isFilterActive('CATEGORY') }"
          @click.native="toggleFilter('CATEGORY')"
          class="m-2"
        >
          Category
          <r-icon :name="isFilterActive('CATEGORY') ? 'mdiChevronUp' : 'mdiChevronDown'" />
        </r-button>
        <r-button
          color="secondary"
          :class="{ 'bg-secondary-dark': isFilterActive('LOCATION') }"
          @click.native="toggleFilter('LOCATION')"
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
        <template v-for="organisationType in organisationTypes">
          <button
            v-if="filters.organisation_types.includes(organisationType.id)"
            color="secondary"
            contrast
            class="my-2 mx-1 p-1 leading-none text-small font-base bg-white text-secondary border-0 font-bold cursor-pointer rounded hover:bg-secondary-dark hover:text-white transition-colors"
            :key="organisationType.id"
            @click="clearFilter('organisation_types', organisationType.id)"
          >
            <span>{{ $i18n.localizeField(organisationType.name) }}</span>
            <r-icon name="mdiClose" class="ml-1" />
          </button>
        </template>
      </div>
      <div v-if="filters.product_categories.length" class="flex flex-wrap align-middle -my-2 -mx-1 mb-2">
        <div class="my-2 ml-1 mr-2">Category:</div>
        <template v-for="category in categories">
          <button
            v-if="filters.product_categories.includes(category.id)"
            class="my-2 mx-1 p-1 leading-none text-small font-base bg-white text-secondary border-0 font-bold cursor-pointer rounded hover:bg-secondary-dark hover:text-white transition-colors"
            :key="category.id"
            @click="clearFilter('product_categories', category.id)"
          >
            {{ $i18n.localizeField(category.name) }}
            <r-icon name="mdiClose" />
          </button>
        </template>
      </div>
      <div v-if="filters.location" class="flex flex-wrap align-middle -m-1">
        <template v-for="organisationType in organisationTypes">
          <r-button
            v-if="filters.organisation_types.includes(organisationType.id)"
            color="secondary"
            contrast
            size="small"
            class="m-1"
            :key="organisationType.id"
            @click.native="clearFilter('organisation_types', organisationType.id)"
          >
            {{ $i18n.localizeField(organisationType.name) }}
            <r-icon name="mdiClose" />
          </r-button>
        </template>
      </div>
    </r-section>
    <section-filter
      v-else-if="isFilterActive('TYPE')"
      :title="$i18n.t('filter.type.title')"
      :text="$i18n.t('filter.type.text')"
      @submit="onFilterSubmit"
      @close="toggleFilter(null)"
    >
      <r-checkbox
        v-for="(organisationType, key) in organisationTypes"
        :key="key"
        v-model="filters.organisation_types"
        :value="organisationType.id"
        :label="$i18n.localizeField(organisationType.name)"
      >
        <template #label>
          <span>
            <r-icon name="mdiMapMarker" :fill="categoryColors[organisationType.code]" class="mr-1" />
            <span>{{ $i18n.localizeField(organisationType.name) }}</span>
          </span>
        </template>
      </r-checkbox>
    </section-filter>
    <section-filter
      v-else-if="isFilterActive('CATEGORY')"
      :title="$i18n.t('filter.category.title')"
      :text="$i18n.t('filter.category.text')"
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
          :key="categoryCode"
          class="py-2 w-100 sm:w-1/2 md:w-1/3 lg:w-1/4"
        >
          <h4 class="text-white mb-1">{{ $i18n.localizeField(categoryGroups[categoryCode].name) }}</h4>
          <div v-for="(category, key) in categoryGroups[categoryCode].data" :key="key">
            <input
              type="checkbox"
              v-model="filters.product_categories"
              :value="category.id"
              :id="`filter-category-${category.id}`"
              class="mr-1"
            />
            <label :for="`filter-category-${category.id}`">{{ $i18n.localizeField(category.name) }}</label>
          </div>
        </div>
      </div>
    </section-filter>
    <section-filter
      v-else-if="isFilterActive('LOCATION') && showLocationFilter"
      :title="$i18n.t('filter.location.title')"
      @submit="submitLocationFilter"
      @close="toggleFilter(null)"
    >
      <r-form-location v-if="false" v-model="locationSearch" label="Locatie" />
      <div v-for="(location, key) in defaultLocations" :key="key">
        <r-radio v-model="filters.bbox" :value="location.bbox" :label="location.name" />
      </div>
    </section-filter>
    <r-section size="0" ref="pageContainer">
      <div class="flex -mx-2 relative items-start">
        <div class="md:w-1/3 px-2" v-show="!isMobile || !isMapView">
          <p class="my-5">{{ $i18n.t('locations.results.n', { n: locationTotal }) }}</p>
          <div class="my-5">
            <template v-for="(location, index) in locations">
              <card-location
                v-if="isCurrentPage(index)"
                :location="location"
                :is-active="activeLocationId === location.id"
                :key="location.id"
                @click.native="onLocationClick(location)"
              >
                <template #locationTitle="slotProps">
                  <slot name="locationTitle" v-bind="slotProps" />
                </template>
              </card-location>
            </template>
          </div>
          <r-pagination v-model="currentPage" :pages="totalPages"></r-pagination>
        </div>
        <div class="md:w-2/3 px-2 md:sticky top-0" v-show="!isMobile || isMapView">
          <div class="h-screen" ref="map"></div>
          <!-- <r-button v-show="showRefreshButton" class="absolute top-1 right-1 z-[999]">Search again</r-button> -->
          <div v-show="false">
            <div ref="popup" class="w-[350px]">
              <card-location v-if="activeLocation" :location="activeLocation" extended>
                <template #locationTitle="slotProps">
                  <slot name="locationTitle" v-bind="slotProps" />
                </template>
              </card-location>
            </div>
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
import {
  RApp,
  RButton,
  RCheckbox,
  RFormLocation,
  RIcon,
  RPagination,
  RRadio,
  RSection,
  icons,
} from 'repair-components';

import SectionFilter from './components/SectionFilter.vue';
import CardLocation from './components/CardLocation.vue';

import Leaflet from 'leaflet';
import axios from 'axios';
import qs from 'qs';

import i18n from './i18n';
import categoryColors from './constants/categoryColors';

import markerImage from './assets/img/markers/default.png';

import 'leaflet/dist/leaflet.css';
import './assets/css/index.css';

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
    RFormLocation,
    RIcon,
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
    locationMarkers: {},
    locationTotal: 0,
    organisationTypes: [],
    categories: [],
    activeLocationId: null,
    showRefreshButton: false,
    activeFilter: null,
    currentPage: 1,
    locationSearch: '',
    i18n,
    isMapView: false,
    filters: {
      organisation_types: [],
      product_categories: [],
      location: null,
    },
  }),
  computed: {
    categoryGroups() {
      const categoryGroups = {};

      this.categories.forEach((category) => {
        if (!category.parent_category) return;

        if (!Object.hasOwnProperty.call(categoryGroups, category.parent_category.code)) {
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
    $i18n() {
      return this.i18n;
    },
    activeLocation() {
      return this.locations.filter((location) => location.id === this.activeLocationId)[0];
    },
    isMobile() {
      return window.innerWidth < 768;
    },
  },

  provide() {
    return {
      $i18n: this.i18n,
      $icons: icons,
      categoryColors,
    };
  },
  watch: {
    locations() {
      this.updateMarkers();
    },
    currentPage() {
      this.scrollIntoView();
    },
    activeLocationId() {
      if (this.activeLocation && Object.prototype.hasOwnProperty.call(this.locationMarkers, this.activeLocation.id)) {
        this.locationMarkers[this.activeLocation.id].fire('click');
      }

      this.scrollIntoView();
    },
  },
  created() {
    if (this.locale) {
      this.$i18n.setLocale(this.locale);
    }

    this.activeFilter = this.filter;
    this.categoryColors = categoryColors;
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
        this.fetchLocations();
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
      for (const locationId in this.locationMarkers) {
        this.map.removeLayer(this.locationMarkers[locationId]);
      }

      const newMarkers = {};

      this.locations.forEach((location) => {
        if (location.geometry.latitude && location.geometry.latitude) {
          const marker = Leaflet.marker([location.geometry.latitude, location.geometry.longitude], {
            icon: Leaflet.icon({
              iconUrl: location.organisation_type
                ? require(`./assets/img/markers/${location.organisation_type.code}.png`)
                : markerImage,
              iconSize: [48, 48],
              iconAnchor: [24, 48],
              popupAnchor: [0, -24],
            }),
          });

          marker.on('click', () => {
            this.openPopup(location.id);
          });

          marker.addTo(this.map);

          newMarkers[location.id] = marker;
        }
      });

      this.locationMarkers = newMarkers;
    },
    fitBounds(location) {
      this.map.fitBounds([location.bbox.slice(0, 2), location.bbox.slice(2)]);
    },
    async fetchLocations() {
      const { filters, defaultQuery } = this;

      const mapBounds = this.map.getBounds();
      const bbox = [mapBounds.getSouth(), mapBounds.getWest(), mapBounds.getNorth(), mapBounds.getEast()];

      const query = qs.stringify(
        {
          ...defaultQuery,
          ...filters,
          bbox,
          per_page: 1000,
        },
        qsOptions
      );

      const {
        data: {
          data,
          meta: { total },
        },
      } = await axios.get(`https://repmap.staging.statik.be/api/v1/locations?${query}`);

      this.locationTotal = total;
      this.locations = data;
    },
    async fetchOrganisationTypes() {
      const query = qs.stringify(this.defaultQuery, qsOptions);

      const {
        data: { data },
      } = await axios.get(`https://repmap.staging.statik.be/api/v1/organisation_types?${query}`);

      this.organisationTypes = data;
    },
    async fetchCategories() {
      const query = qs.stringify(this.defaultQuery, qsOptions);

      const {
        data: { data },
      } = await axios.get(`https://repmap.staging.statik.be/api/v1/product_categories?${query}`);

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
      if (this.activeLocationId === location.id) {
        this.activeLocationId = null;
      } else {
        this.openPopup(location.id);
      }
    },
    onFilterSubmit() {
      this.toggleFilter(null);
      this.fetchLocations();
    },
    scrollIntoView() {
      this.$refs.pageContainer.$el.scrollIntoView({
        behavior: 'smooth',
      });
    },
    openPopup(locationId) {
      const marker = this.locationMarkers[locationId];

      marker.unbindPopup();
      this.activeLocationId = locationId;
      marker
        .bindPopup(this.$refs.popup, {
          maxWidth: 350,
          closeButton: false,
        })
        .openPopup();
    },
  },
};
</script>
