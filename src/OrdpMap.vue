<template>
  <div id="repair-map">
    <r-app class="relative">
      <r-section v-if="showFilterButtons" :container="false">
        <h2 class="text-h2 text-secondary">{{ $t('page_title') }}</h2>
        <div class="mb-3 font-bold">{{ $t('label_search_by') }}</div>
        <div class="flex flex-wrap -m-2">
          <r-button
            color="secondary"
            :class="{ 'bg-secondary-dark': isFilterActive('TYPE') }"
            @click.native="toggleFilter('TYPE')"
            class="m-2"
          >
            {{ $t('filter_type_label') }}
            <r-icon :name="isFilterActive('TYPE') ? 'mdiChevronUp' : 'mdiChevronDown'" />
          </r-button>
          <r-button
            color="secondary"
            :class="{ 'bg-secondary-dark': isFilterActive('CATEGORY') }"
            @click.native="toggleFilter('CATEGORY')"
            class="m-2"
          >
            {{ $t('filter_category_label') }}
            <r-icon :name="isFilterActive('CATEGORY') ? 'mdiChevronUp' : 'mdiChevronDown'" />
          </r-button>
          <r-button
            v-if="mapboxSearchConfig"
            color="secondary"
            :class="{ 'bg-secondary-dark': isFilterActive('LOCATION') }"
            @click.native="toggleFilter('LOCATION')"
            class="m-2"
          >
            {{ $t('filter_location_label') }}
            <r-icon :name="isFilterActive('LOCATION') ? 'mdiChevronUp' : 'mdiChevronDown'" />
          </r-button>
        </div>
      </r-section>
      <!-- TYPE FILTER -->
      <section-filter
        v-if="isFilterActive('TYPE')"
        :title="$t('filter_type_title')"
        :text="$t('filter_type_text')"
        @close="toggleFilter(null)"
        class="relative z-10"
      >
        <r-checkbox
          v-for="(organisationType, key) in ordsStandard.organisationTypes"
          :key="key"
          v-model="filters.organisation_types"
          :value="organisationType"
          :label="$t('filter_type_' + organisationType + '_label')"
        >
          <template #label>
            <span>
              <r-icon name="mdiMapMarker" :fill="categoryColors[organisationType]" class="mr-1" />
              <span>{{ $t('filter_type_' + organisationType + '_label') }}</span>
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
        <div class="mb-6">
          <r-grid class="!mt-0">
            <r-grid-item
                v-for="category in ordsStandard.productCategories"
                :key="category.id"
                class="sm:w-1/2 md:w-1/3 lg:w-1/4 !mt-0"
            >
              <r-checkbox v-model="filters.product_categories" :label="category.label" :value="category.id" />
            </r-grid-item>
          </r-grid>
        </div>
      </section-filter>
      <!-- LOCATION FILTER -->
      <section-filter
        v-else-if="isFilterActive('LOCATION') && mapboxSearchConfig"
        :title="$t('filter_location_title')"
        @submit="submitLocationFilter"
        @close="toggleFilter(null)"
      >
        <r-mapbox-search
          v-model="locationSearch"
          :label="$t('filter_location_search_label')"
          :placeholder="$t('filter_location_search_placeholder')"
          :config="mapboxSearchConfig"
          class="max-w-2xl"
          required
        />
      </section-filter>
      <!-- ACTIVE FILTERS -->
      <r-section
        v-if="showActiveFilters"
        color="secondary"
        :class="{ 'border-t-1 border-solid border-secondary-dark': showActiveFilters && !isFilterActive(null) }"
      >
        <h3 class="text-white text-h3">{{ $t('active_filters') }}</h3>
        <div v-if="filters.organisation_types.length" class="flex flex-wrap mb-2 -mx-1 -my-2 align-middle">
          <div class="my-2 ml-1 mr-2">{{ $t('type_filters') }}</div>
          <template v-for="organisationType in ordsStandard.organisationTypes">
            <button
              v-if="filters.organisation_types.includes(organisationType)"
              color="secondary"
              contrast
              class="p-1 mx-1 my-2 font-bold leading-none transition-colors bg-white border-0 rounded cursor-pointer text-small font-base text-secondary hover:bg-secondary-dark hover:text-white"
              :key="organisationType"
              @click="clearFilter('organisation_types', organisationType)"
            >
              <span>{{ $t('filter_type_' + organisationType + '_label') }}</span>
              <r-icon name="mdiClose" class="ml-1" />
            </button>
          </template>
        </div>
        <div v-if="filters.product_categories.length" class="flex flex-wrap mb-2 -mx-1 -my-2 align-middle">
          <div class="my-2 ml-1 mr-2">{{ $t('category_filters') }}</div>
          <template v-for="category in ordsStandard.productCategories">
            <button
              v-if="filters.product_categories.includes(category.id)"
              class="p-1 mx-1 my-2 font-bold leading-none transition-colors bg-white border-0 rounded cursor-pointer text-small font-base text-secondary hover:bg-secondary-dark hover:text-white"
              :key="category.id"
              @click="clearFilter('product_categories', category.id)"
            >
              {{ category.label }}
              <r-icon name="mdiClose" />
            </button>
          </template>
        </div>
        <div v-if="filters.location" class="flex flex-wrap -m-1 align-middle">
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
      <div class="relative">
        <r-section ref="pageContainer" :container="false" class="!py-0" :class="{ invisible: isRendering }">
          <div
            class="relative flex flex-wrap items-start -mx-2 md:flex-nowrap"
            :style="embed && windowWidth > 768 ? `min-height: ${windowHeight}px;` : ''"
          >
            <!-- LOCATION LIST -->
            <div v-show="!isMobile" class="relative hidden w-full px-2 md:block md:w-1/3">
              <r-loader v-show="isLoading" class="left-0 right-0 top-8 bottom-full" />
              <div
                :class="{ invisible: isLoading }"
                :style="
                  embed && windowWidth > 768 ? `height: ${windowHeight}px; overflow-y: auto; padding-right: 8px` : ''
                "
              >
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
                        <slot name="locationTitle" v-bind="slotProps">
                          <a
                            v-if="embed"
                            :href="location.landingPage"
                            :class="slotProps.defaultClass"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {{ location.name || $t('location_name_fallback') }}
                          </a>
                        </slot>
                      </template>
                    </card-location>
                  </template>
                </div>
                <r-pagination v-model="currentPage" :pages="totalPages"></r-pagination>
              </div>
            </div>
            <!-- LEAFLET MAP -->
            <div class="top-0 w-full px-2 md:w-2/3" :class="{ 'md:sticky': !embed }">
              <div class="relative z-10">
                <div class="aspect-w-1 h-[525px] sm:h-auto sm:aspect-none" :class="{ 'md:aspect-none': !embed }">
                  <div
                    :class="{ 'md:h-screen': !embed }"
                    :style="embed && windowWidth > 768 ? `height: ${windowHeight}px;` : ''"
                    ref="map"
                  ></div>
                </div>
              </div>
              <div v-show="false">
                <div ref="popup" class="w-[325px] sm:w-[350px] relative">
                  <card-location v-if="activeLocation" :location="activeLocation" extended>
                    <template #locationTitle="slotProps">
                      <slot name="locationTitle" v-bind="slotProps">
                        <a
                          v-if="embed"
                          :href="activeLocation.landingPage"
                          :class="slotProps.defaultClass"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {{ activeLocation.name || $t('location_name_fallback') }}
                        </a>
                      </slot>
                    </template>
                  </card-location>
                  <button
                    type="button"
                    class="absolute px-3 py-2 bg-transparent bg-opacity-0 border-0 cursor-pointer rounded-xl top-1 right-1 hover:text-primary"
                    @click="closePopup()"
                  >
                    <span class="sr-only">{{ $t('popup_close') }}</span>
                    <r-icon name="mdiClose" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </r-section>
      </div>
      <r-section :container="false">
        <r-panel>
          <h2 class="text-h2 text-secondary">{{ $t('create_new_title') }}</h2>
          <p class="mb-6 md:w-8/12">{{ $t('create_new_text') }}</p>
          <slot name="suggestionCta">
            <r-button
              :href="`https://mapping.sharepair.org/${$i18n.locale}/location/create`"
              link
              color="secondary"
              icon-after="mdiChevronRight"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $t('create_new_cta') }}
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
} from '@statikbe/repair-components';

import categoryColors from '../src/constants/categoryColors';

import SectionFilter from './components/SectionFilter.vue';
import CardLocation from './components/ordp/CardLocation.vue';

import Leaflet from 'leaflet';
import qs from 'qs';
import debounce from 'lodash.debounce';

import 'leaflet.markercluster';

import markerImage from './assets/img/markers/default.png';

import 'iframe-resizer/js/iframeResizer.contentWindow.min.js';

import { locationsQuery, ordsStandardQuery } from './graphql/queries.js';

const qsOptions = {
  arrayFormat: 'comma',
};

const defaultCenter = [50.87959, 4.70093];

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

// For canceling previous request due to a new request on the map
// TODO: Update axios and use the new abort api
// const CancelToken = axios.CancelToken;
// let cancel;

// console.log(mapBounds);

export default {
  name: 'repair-map',
  apollo: {
    locations: {
      query: locationsQuery,
      loadingKey: 'loading',
      variables() {
        const mapBounds = this.map.getBounds();

        return {
          locale: this.locale.toUpperCase(),
          xMax: mapBounds.getNorth(),
          xMin: mapBounds.getSouth(),
          yMax: mapBounds.getEast(),
          yMin: mapBounds.getWest(),
          organisationTypeCode: this.filters.organisation_types.length === 0 ? null : this.filters.organisation_types,
          productCategory: this.filters.product_categories.length === 0 ? null : this.filters.product_categories,
        };
      },
      skip() {
        return this.shouldSkipOrdpQuery();
      },
      // Optional result hook
      result({ data }) {
        this.isLoading = false;
        if (data.locations) {
          this.locationTotal = data.locations.length;
        }
      },
      update(data) {
        const ordsStandard = this.ordsStandard;
        return data.locations.map(function(location){
          location.productCategories = location.productCategory.map(function(categoryId) {
            if (categoryId) {
              return ordsStandard.productCategories.find(category => category.id === categoryId).label
            }
          });
          return location;
        });
      },
    },
    ordsStandard: {
      query: ordsStandardQuery,
      loadingKey: 'loading',
      skip: true,
      // Optional result hook
      result({ data }) {
        console.log(data);
        this.isLoading = false;
      },
    },
  },
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
      default: () => defaultCenter,
    },
    defaultZoom: {
      type: Number,
      default: () => 14,
    },
    locale: {
      type: String,
      default: () => qs.parse(location.search.substr(1)).lang || document.documentElement.lang || 'en',
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
    apiBaseUrl: {
      type: String,
      default: () => process.env.VUE_APP_API_BASE_URL,
    },
    embed: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    locations: [],
    locationMarkers: {},
    locationTotal: 0,
    ordsStandard: {
      organisationTypes: [],
      productCategories: [],
    },
    categoryGroups: {},
    activeLocationId: null,
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
    categoriesAllSelectedGroup: {},
  }),
  computed: {
    categoryColors() {
      return categoryColors;
    },
    showActiveFilters() {
      const { filters } = this;
      // const parentCategory = this.categories;
      return filters.organisation_types.length || filters.product_categories.length;
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
      const access_token = this.mapboxAccessToken || qs.parse(location.search.substr(1)).mapboxAccessToken;
      return access_token
        ? {
            access_token,
            country: 'be,nl,fr,de,lu,gb,ch,at,us,ie',
            limit: 10,
            types: 'place,locality,postcode',
            fuzzyMatch: false,
          }
        : null;
    },
    windowHeight() {
      return windowHeight;
    },
    windowWidth() {
      return windowWidth;
    },
  },
  watch: {
    // categories() {
    //   this.categories.forEach((category) => {
    //     //  if category is parent: add to the parent group for allSelectedItems
    //     if (!category.parent_category) {
    //       this.categoriesAllSelectedGroup[category.code] = false;
    //       return;
    //     }
    //     // if category is child: add to parent group
    //     if (!Object.hasOwnProperty.call(this.categoryGroups, category.parent_category.code)) {
    //       this.categoryGroups[category.parent_category.code] = {
    //         ...category.parent_category,
    //         data: [],
    //       };
    //     }
    //     this.categoryGroups[category.parent_category.code].data.push(category);
    //   });
    // },
    locations() {
      this.updateMarkers();
    },
    currentPage() {
      this.scrollIntoView();
    },
    activeLocationId() {
      // TODO: Check if this is still needed
      // if (this.activeLocation && Object.prototype.hasOwnProperty.call(this.locationMarkers, this.activeLocation.id)) {
      //   // console.log(this.locationMarkers[this.activeLocation.id].fire('click'));
      //   this.locationMarkers[this.activeLocation.id].fire('click');
      //   // return this.locationMarkers[this.activeLocation.id];
      // }
      console.log('activeLocationId changed');
      // this.scrollIntoView();
    },
    filter(filter) {
      this.activeFilter = filter;
    },
    filters: {
      deep: true,
      handler() {
        this.checkIfAllSelected();
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
    this.activeFilter = this.filter;
  },
  async mounted() {
    if (this.$i18n) {
      this.$i18n.locale = this.locale;
    }

    this.setFiltersFromUrl();
    this.renderMap();
    this.setBboxFromUrl();

    // If url parameter bbox is not set, ask for location
    const params = qs.parse(location.search.substr(1), qsOptions);
    if (
      this.defaultCenter[0] === defaultCenter[0] &&
      this.defaultCenter[1] === defaultCenter[1] &&
      navigator.geolocation &&
      !params.bbox
    ) {
      await this.askLocation();
    }

    // console.log('hey');
    this.isRendering = false;
    this.fetchLocations();
    this.fetchOrdsStandard();
    // this.fetchCategories();
  },
  methods: {
    fetchLocations() {
      this.$apollo.queries.locations.skip = this.shouldSkipOrdpQuery();
      this.$apollo.queries.locations.refetch();
    },
    fetchOrdsStandard() {
      this.$apollo.queries.ordsStandard.skip = false;
      this.$apollo.queries.ordsStandard.refetch();
    },
    getCategoryCodesForGroup(groupName) {
      let categoryCodes = [];
      this.categoryGroups[groupName].data.forEach((category) => {
        categoryCodes.push(category.code);
      });

      return categoryCodes;
    },
    checkIfAllSelected() {
      const { filters } = this;
      // loop through the categoryGroups and check if the categories are all checked from this group
      for (const code of Object.keys(this.categoryGroups)) {
        this.categoriesAllSelectedGroup[code] = this.getCategoryCodesForGroup(code).every((code) => {
          return filters.product_categories.includes(code);
        });
      }
    },
    selectAllCategories(categoryGroup) {
      let categoryGroupCodes = this.getCategoryCodesForGroup(categoryGroup);
      if (this.categoriesAllSelectedGroup[categoryGroup]) {
        // add items to filter array
        categoryGroupCodes.forEach((categoryCode) => {
          if (!this.filters.product_categories.includes(categoryCode)) {
            // only add when not already in filter array
            this.filters.product_categories.push(categoryCode);
          }
        });
      } else {
        // remove items from filter array
        categoryGroupCodes.forEach((categoryCode) => {
          const index = this.filters.product_categories.indexOf(categoryCode);
          if (index > -1) {
            // only remove when in filter array
            this.filters.product_categories.splice(index, 1);
          }
        });
      }
    },
    setFiltersFromUrl() {
      const params = qs.parse(location.search.substr(1), qsOptions);
      const { filters } = this;

      if (params.organisation_types) {
        if (Array.isArray(params.organisation_types)) {
          filters.organisation_types = params.organisation_types;
        } else {
          filters.organisation_types = params.organisation_types.split(',');
        }
      }

      if (params.product_categories) {
        if (Array.isArray(params.product_categories)) {
          filters.product_categories = params.product_categories;
        } else {
          filters.product_categories = params.product_categories.split(',');
        }
      }
    },
    setBboxFromUrl() {
      const params = qs.parse(location.search.substr(1), qsOptions);

      if (params.bbox) {
        const bbox = params.bbox.split(',');

        this.map.fitBounds([
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ]);
      }
    },
    askLocation() {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((position) => {
          this.map.setView(new Leaflet.LatLng(position.coords.latitude, position.coords.longitude));
          resolve();
        }, resolve);
      });
    },
    renderMap() {
      this.map = Leaflet.map(this.$refs.map, {
        scrollWheelZoom: false,
      }).setView([this.defaultCenter[0], this.defaultCenter[1]], this.defaultZoom);

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
        if (location.geometry.coordinates) {
          const marker = Leaflet.marker(location.geometry.coordinates, {
            icon: Leaflet.icon({
              iconUrl: location.organisationTypeCode
                ? require(`./assets/img/markers/${location.organisationTypeCode}.png`)
                : markerImage,
              iconSize: [20, 32],
              iconAnchor: [10, 32],
              popupAnchor: [0, -16],
            }),
          });

          marker.on('click', () => {
            this.openPopup(location.id);
          });

          this.markerClusterGroup.addLayer(marker);

          newMarkers[location.id] = marker;
        }
      });

      this.map.addLayer(this.markerClusterGroup);
      this.locationMarkers = newMarkers;

      if (this.activeLocation && Object.prototype.hasOwnProperty.call(this.locationMarkers, this.activeLocation.id)) {
        this.openPopup(this.activeLocation.id);
      }
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
        this.closePopup();
      } else {
        // Check if the location is in a cluster group and then use the zoomToShowLayer function to zoom to the cluster group
        if (this.markerClusterGroup.hasLayer(this.locationMarkers[location.id])) {
          this.markerClusterGroup.zoomToShowLayer(this.locationMarkers[location.id], () => {
            this.openPopup(location.id);
          });
        } else {
          this.openPopup(location.id);
        }
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
    shouldSkipOrdpQuery() {
      return !this.map || !this.locale;
    },
    closePopup() {
      this.activeLocationId = null;
      this.map.closePopup();
    },
    parseLocations(locations) {
      return locations.map(function(element) {
        console.log(element);
        return element;
      });
    }
  },
};
</script>

<style src="leaflet/dist/leaflet.css"></style>
<style src="leaflet.markercluster/dist/MarkerCluster.css"></style>
<style src="leaflet.markercluster/dist/MarkerCluster.Default.css"></style>
<style src="./assets/css/app.css"></style>
<style lang="css">
.category-group > label span {
  font-weight: bold;
}
</style>
