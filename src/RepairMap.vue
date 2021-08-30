<template>
  <div id="repair-map">
    <r-app class="relative">
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
              v-if="filters.organisation_types.includes(organisationType.code)"
              color="secondary"
              contrast
              class="my-2 mx-1 p-1 leading-none text-small font-base bg-white text-secondary border-0 font-bold cursor-pointer rounded hover:bg-secondary-dark hover:text-white transition-colors"
              :key="organisationType.code"
              @click="clearFilter('organisation_types', organisationType.code)"
            >
              <span>{{ $localizeField(organisationType.name) }}</span>
              <r-icon name="mdiClose" class="ml-1" />
            </button>
          </template>
        </div>
        <div v-if="filters.product_categories.length" class="flex flex-wrap align-middle -my-2 -mx-1 mb-2">
          <div class="my-2 ml-1 mr-2">Category:</div>
          <template v-for="category in categories">
            <button
              v-if="filters.product_categories.includes(category.code)"
              class="my-2 mx-1 p-1 leading-none text-small font-base bg-white text-secondary border-0 font-bold cursor-pointer rounded hover:bg-secondary-dark hover:text-white transition-colors"
              :key="category.code"
              @click="clearFilter('product_categories', category.code)"
            >
              {{ $localizeField(category.name) }}
              <r-icon name="mdiClose" />
            </button>
          </template>
        </div>
        <div v-if="filters.location" class="flex flex-wrap align-middle -m-1">
          <template v-for="organisationType in organisationTypes">
            <r-button
              v-if="filters.organisation_types.includes(organisationType.code)"
              color="secondary"
              contrast
              size="small"
              class="m-1"
              :key="organisationType.code"
              @click.native="clearFilter('organisation_types', organisationType.code)"
            >
              {{ $localizeField(organisationType.name) }}
              <r-icon name="mdiClose" />
            </r-button>
          </template>
        </div>
      </r-section>
      <!-- TYPE FILTER -->
      <section-filter
        v-else-if="isFilterActive('TYPE')"
        :title="$t('filter_type_title')"
        :text="$t('filter_type_text')"
        @close="toggleFilter(null)"
      >
        <r-checkbox
          v-for="(organisationType, key) in organisationTypes"
          :key="key"
          v-model="filters.organisation_types"
          :value="organisationType.code"
          :label="$localizeField(organisationType.name)"
        >
          <template #label>
            <span>
              <r-icon name="mdiMapMarker" :fill="categoryColors[organisationType.code]" class="mr-1" />
              <span>{{ $localizeField(organisationType.name) }}</span>
            </span>
          </template>
        </r-checkbox>
      </section-filter>
      <!-- CATEGORY FILTER -->
      <section-filter
        v-else-if="isFilterActive('CATEGORY')"
        :title="$t('filter_category_title')"
        :text="$t('filter_category_text')"
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
            <div class="text-white font-bold ml-1">
              {{ $localizeField(categoryGroups[categoryCode].name) }}
            </div>
            <r-checkbox
              v-model="filters.product_categories"
              v-for="(category, key) in categoryGroups[categoryCode].data"
              :key="key"
              :label="$localizeField(category.name)"
              :value="category.code"
            />
          </div>
        </div>
      </section-filter>
      <!-- LOCATION FILTER -->
      <section-filter
        v-else-if="isFilterActive('LOCATION')"
        :title="$t('filter_location_title')"
        @submit="submitLocationFilter"
        @close="toggleFilter(null)"
      >
        <r-mapbox-search
          v-model="locationSearch"
          :label="$t('filter_location_label')"
          :config="mapboxSearchConfig"
          class="max-w-2xl"
          required
        />
      </section-filter>
      <div class="relative">
        <r-loader v-if="isRendering" />
        <r-section size="0" ref="pageContainer" :class="{ invisible: isRendering }">
          <div class="flex flex-wrap md:flex-nowrap -mx-2 relative items-start">
            <!-- LOCATION LIST -->
            <div class="w-full md:w-1/3 px-2 relative">
              <r-loader v-if="isLoading" />
              <div :class="{ invisible: isLoading }">
                <p class="my-6">{{ $t('locations_results_n', { n: locationTotal }) }}</p>
                <div class="my-6">
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
            </div>
            <!-- LEAFLET MAP -->
            <div class="w-full md:w-2/3 px-2 md:sticky top-0">
              <div class="relative">
                <r-button
                  color="secondary"
                  v-show="showRefreshButton"
                  class="absolute top-2 right-2 z-[999]"
                  @click.native="fetchLocations"
                >
                  <r-icon name="mdiRefresh" />
                  Search again in this area
                </r-button>
                <div class="aspect-w-1 aspect-h-1 md:aspect-none">
                  <div class="md:h-screen" ref="map"></div>
                </div>
              </div>
              <div v-show="false">
                <div ref="popup" class="w-[350px] relative">
                  <card-location v-if="activeLocation" :location="activeLocation" extended>
                    <template #locationTitle="slotProps">
                      <slot name="locationTitle" v-bind="slotProps" />
                    </template>
                  </card-location>
                  <button
                    type="button"
                    class="absolute top-3 right-3 border-0 padding-0 bg-opacity-0 cursor-pointer"
                    @click="map.closePopup()"
                  >
                    <r-icon name="mdiClose" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </r-section>
      </div>
      <r-section>
        <r-panel>
          <h2 class="text-h2 text-secondary">A repair initiative missing on the map?</h2>
          <p class="md:w-8/12 mb-6">
            Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Curabitur blandit tempus
            porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <slot name="suggestionCta">
            <r-button
              href="https://mapping.sharepair.org/location/new"
              link
              color="secondary"
              icon-after="mdiChevronRight"
              target="_blank"
            >
              Suggest a repair initiative that is not on the map
            </r-button>
          </slot>
        </r-panel>
      </r-section>
    </r-app>
  </div>
</template>

<script>
import {
  RApp,
  RButton,
  RCheckbox,
  RIcon,
  RLoader,
  RMapboxSearch,
  RPagination,
  RPanel,
  RSection,
} from 'repair-components';

import categoryColors from '../src/constants/categoryColors';

import SectionFilter from './components/SectionFilter.vue';
import CardLocation from './components/CardLocation.vue';

import Leaflet from 'leaflet';
import axios from 'axios';
import qs from 'qs';
import debounce from 'lodash.debounce';

import 'leaflet.markercluster';

import markerImage from './assets/img/markers/default.png';

const qsOptions = {
  arrayFormat: 'comma',
};

export default {
  name: 'repair-map',
  components: {
    CardLocation,
    RApp,
    RButton,
    RCheckbox,
    RIcon,
    RLoader,
    RMapboxSearch,
    RPagination,
    RPanel,
    RSection,
    SectionFilter,
  },
  provide() {
    return {
      $icons: this.$icons,
    };
  },
  props: {
    filter: {
      type: String,
      default: () => null,
    },
    defaultCenter: {
      type: Array,
      default: () => [50.87959, 4.70093],
    },
    defaultZoom: {
      type: Number,
      default: () => 14,
    },
    locale: {
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
    mapboxAccessToken: {
      type: String,
      default: () => null,
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
    locationSearch: null,
    markerClusterGroup: null,
    isMapView: false,
    isLoading: true,
    isRendering: true,
    filters: {
      organisation_types: [],
      product_categories: [],
      location: null,
    },
  }),
  computed: {
    categoryColors() {
      return categoryColors;
    },
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
    activeLocation() {
      return this.locations.filter((location) => location.id === this.activeLocationId)[0];
    },
    isMobile() {
      return window.innerWidth < 768;
    },
    mapboxSearchConfig() {
      return {
        access_token: this.mapboxAccessToken,
        country: 'be,nl,fr,de,lu,gb,ch,at,us,ie',
        limit: 10,
        types: 'place,locality,postcode',
        fuzzyMatch: false,
      };
    },
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
    filter(filter) {
      this.activeFilter = filter;
    },
    filters: {
      deep: true,
      handler() {
        this.fetchLocations();
      },
    },
    locationSearch({ bbox }) {
      this.map.fitBounds([
        [bbox[1], bbox[0]],
        [bbox[3], bbox[2]],
      ]);
    },
  },
  created() {
    if (this.locale) {
      this.i18n.setLocale(this.locale);
    }

    this.activeFilter = this.filter;
  },
  async mounted() {
    this.renderMap();
    await this.askLocation();
    this.isRendering = false;
    this.fetchLocations();
    this.fetchOrganisationTypes();
    this.fetchCategories();
  },
  methods: {
    askLocation() {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((position) => {
          this.map.setView(new Leaflet.LatLng(position.coords.latitude, position.coords.longitude));
          resolve();
        }, resolve);
      });
    },
    renderMap() {
      this.map = Leaflet.map(this.$refs.map).setView([this.defaultCenter[0], this.defaultCenter[1]], this.defaultZoom);

      Leaflet.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        maxZoom: 19,
        attribution: `&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
      }).addTo(this.map);

      this.map.on('movestart', () => {
        this.isLoading = true;
      });

      this.map.on(
        'moveend',
        debounce(() => {
          !this.isRendering && this.fetchLocations();
        }, 500)
      );
    },
    updateMarkers() {
      if (this.markerClusterGroup) {
        this.map.removeLayer(this.markerClusterGroup);
      }

      const newMarkers = {};

      this.markerClusterGroup = Leaflet.markerClusterGroup({
        showCoverageOnHover: false,
      });

      this.locations.forEach((location) => {
        if (location.geometry.latitude && location.geometry.latitude) {
          const marker = Leaflet.marker([location.geometry.latitude, location.geometry.longitude], {
            icon: Leaflet.icon({
              iconUrl: location.organisation_type
                ? require(`./assets/img/markers/${location.organisation_type.code}.png`)
                : markerImage,
              iconSize: [20, 32],
              iconAnchor: [10, 32],
              popupAnchor: [0, -16],
            }),
          });

          marker.on('click', () => {
            this.openPopup(location.id);
          });

          // marker.addTo(this.map);
          this.markerClusterGroup.addLayer(marker);

          newMarkers[location.id] = marker;
        }
      });

      this.map.addLayer(this.markerClusterGroup);
      this.locationMarkers = newMarkers;
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

      this.isLoading = true;

      const {
        data: {
          data,
          meta: { total },
        },
      } = await axios.get(`https://repmap.staging.statik.be/api/v1/locations?${query}`);

      this.locationTotal = total;
      this.locations = data;
      this.isLoading = false;
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

<style src="leaflet/dist/leaflet.css"></style>
<style src="leaflet.markercluster/dist/MarkerCluster.css"></style>
<style src="leaflet.markercluster/dist/MarkerCluster.Default.css"></style>
<style src="./assets/css/app.css"></style>
