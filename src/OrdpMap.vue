<template>
  <div id="repair-map">
    <r-app class="relative">
      <r-section v-if="showFilterButtons" :container="false">
        <div class="mb-3 font-bold">{{ $t('label_filter_by') }}</div>
        <div class="flex flex-wrap -m-2">
          <a
            href="#"
            class="m-2 font-semibold text-secondary"
            :class="{ '!font-bold !text-secondary-dark': isFilterActive('CATEGORY') }"
            @click.prevent="toggleFilter('CATEGORY')"
          >
            {{ $t('filter_category_label') }}
            <r-icon :name="isFilterActive('CATEGORY') ? 'mdiChevronUp' : 'mdiChevronDown'" />
          </a>

          <a
            href="#"
            class="m-2 font-semibold text-secondary"
            :class="{ '!font-bold !text-secondary-dark': isFilterActive('LOCATION') }"
            @click.prevent="toggleFilter('LOCATION')"
          >
            {{ $t('filter_location_label') }}
            <r-icon :name="isFilterActive('LOCATION') ? 'mdiChevronUp' : 'mdiChevronDown'" />
          </a>

          <a
            href="#"
            class="m-2 font-semibold text-secondary"
            :class="{ '!font-bold !text-secondary-dark': isFilterActive('TYPE') }"
            @click.prevent="toggleFilter('TYPE')"
          >
            {{ $t('filter_type_label') }}
            <r-icon :name="isFilterActive('TYPE') ? 'mdiChevronUp' : 'mdiChevronDown'" />
          </a>

          <a
            href="#"
            class="m-2 font-semibold text-secondary"
            :class="{ '!font-bold !text-secondary-dark': isFilterActive('ECOCHEQUES') }"
            @click.prevent="toggleFilter('ECOCHEQUES')"
          >
            {{ $t('filter_ecocheques_label') }}
            <r-icon :name="isFilterActive('ECOCHEQUES') ? 'mdiChevronUp' : 'mdiChevronDown'" />
          </a>
        </div>
      </r-section>
      <!-- CATEGORY FILTER -->
      <section-filter
        v-if="isFilterActive('CATEGORY')"
        @close="toggleFilter(null)"
        :class="!showActiveFilters ? 'mb-6 sm:mb-12' : ''"
      >
        <category-group
          v-for="(categoryGroup, categoryKey) in circufixCategoryGroups"
          :key="categoryKey"
          :categoryGroup="categoryGroup"
          v-model="filters.product_categories"
          v-bind:group="categoriesAllSelectedGroup[categoryGroup.code]"
          v-on:input-group="categoriesAllSelectedGroup[categoryGroup.code] = $event"
          @select-all="selectAllCategories"
        ></category-group>
      </section-filter>
      <!-- LOCATION FILTER -->
      <section-filter
        v-else-if="isFilterActive('LOCATION')"
        @close="toggleFilter(null)"
        :class="!showActiveFilters ? 'mb-6 sm:mb-12' : ''"
      >
        <r-mapbox-search
          v-if="mapboxSearchConfig"
          v-model="locationSearch"
          :label="$t('filter_location_search_label')"
          :placeholder="$t('filter_location_search_placeholder')"
          :config="mapboxSearchConfig"
          class="max-w-2xl"
          required
        />
        <r-select
          class=""
          track-by="id"
          label-by="name"
          :searchable="true"
          :label="$t('label_search_by')"
          required
          :placeholder="$t('label_search_by_repairer')"
          open-direction="bottom"
          :options="searchLocations"
          :multiple="false"
          :loading="isLoading"
          :internal-search="false"
          :clear-on-select="false"
          :close-on-select="true"
          :max-height="600"
          :options-limit="300"
          :show-no-results="false"
          @search-change="debounceSearchLocations"
          @select="selectSearchLocation"
        />
      </section-filter>
      <!-- TYPE FILTER -->
      <section-filter
        v-else-if="isFilterActive('TYPE')"
        @close="toggleFilter(null)"
        class="relative z-10"
        :class="!showActiveFilters ? 'mb-6 sm:mb-12' : ''"
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
      <section-filter
        v-if="isFilterActive('ECOCHEQUES')"
        @close="toggleFilter(null)"
        :class="!showActiveFilters ? 'mb-6 sm:mb-12' : ''"
      >
        <div class="mb-6">
          <r-grid class="!mt-0">
            <r-grid-item v-for="ecoCheque in ecoCheques" :key="ecoCheque.id" class="sm:w-1/2 md:w-1/3 lg:w-1/4 !mt-0">
              <r-checkbox
                v-model="filters.ecocheques"
                :label="$t('filter_ecocheques_' + ecoCheque.code + '_label')"
                :value="ecoCheque.code"
              />
            </r-grid-item>
          </r-grid>
        </div>
      </section-filter>
      <!-- ACTIVE FILTERS -->
      <r-section
        v-if="showActiveFilters"
        color="secondary"
        :class="{
          'border-t-1 border-solid border-l-0 border-b-0 border-r-0 border-secondary-dark':
            showActiveFilters && !isFilterActive(null),
        }"
        class="mb-6 sm:mb-12"
      >
        <div v-if="filters.product_categories.length" class="flex flex-wrap -mx-1 -my-2 align-middle">
          <div class="my-2 ml-1 mr-2">{{ $t('category_filters') }}</div>
          <template v-for="category in filters.product_categories">
            <button
              class="p-1 mx-1 my-2 font-bold leading-none transition-colors bg-white border-0 rounded cursor-pointer text-small font-base text-secondary hover:bg-secondary-dark hover:text-white"
              :key="category.id"
              @click="clearFilter('product_categories', category)"
            >
              {{ $t('circufix_category_' + category + '_label') }}
              <r-icon name="mdiClose" />
            </button>
          </template>
        </div>
        <div
          v-if="filters.organisation_types.length"
          class="flex flex-wrap -mx-1 -my-2 align-middle"
          :class="{ 'mb-2': filters.product_categories.length }"
        >
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
        <div v-if="filters.ecocheques.length" class="flex flex-wrap -mx-1 -my-2 align-middle">
          <div class="my-2 ml-1 mr-2">{{ $t('filter_ecocheques_label') }}:</div>
          <template v-for="(ecocheque, key) in filters.ecocheques">
            <button
              class="p-1 mx-1 my-2 font-bold leading-none transition-colors bg-white border-0 rounded cursor-pointer text-small font-base text-secondary hover:bg-secondary-dark hover:text-white"
              :key="key"
              @click="clearFilter('ecocheques', ecocheque)"
            >
              <span>{{ $t('filter_ecocheques_' + ecocheque + '_label') }}</span>
              <r-icon name="mdiClose" />
            </button>
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
                <p class="my-6" ref="listContainer">{{ $t('locations_results_n', { n: locationTotal }) }}</p>
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
              <!-- ERROR -->
              <div v-if="error" class="block w-full">
                <div class="mb-4 font-bold text-base leading-5 text-error opacity-100">
                  {{ error }}
                </div>
              </div>
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
              :href="`https://mapping.sharepair.org/${locale}/location/create`"
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
import CategoryGroup from './components/ordp/CategoryGroup.vue';

import Leaflet from 'leaflet';
import qs from 'qs';
import debounce from 'lodash.debounce';

import 'leaflet.markercluster';

import markerImage from './assets/img/markers/default.png';

import { locationsBboxQuery, locationsQuery, ordsEcoCheques, ordsStandardQuery } from './graphql/queries.js';
import ApolloClient from 'apollo-boost';

const qsOptions = {
  arrayFormat: 'comma',
};

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

export default {
  name: 'ordp-map',
  apollo: {
    $client: 'ordp',
    locations: {
      query: locationsBboxQuery,
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
          circufixCategory: this.filters.product_categories.length === 0 ? null : this.filters.product_categories,
          ecoCheques: this.filters.ecocheques.length === 0 ? null : this.filters.ecocheques,
        };
      },
      skip() {
        return this.shouldSkipOrdpQuery();
      },
      // Optional result hook
      result({ data }) {
        this.isLoading = false;
        this.locationTotal = 0;
        if (data.locations) {
          this.locationTotal = data.locations.length;
        }
      },
      update(data) {
        if (data.locations?.length) {
          return data.locations;
        }

        return [];
      },
      error() {
        this.error = 'Something went wrong loading the map.';
      },
    },
    searchLocations: {
      query: locationsQuery,
      loadingKey: 'loading',
      variables() {
        return {
          locale: this.locale.toUpperCase(),
          search: this.search,
        };
      },
      skip: true,
      // Optional result hook
      result() {
        this.isLoading = false;
      },
      update(data) {
        return data.locations;
      },
    },
    ordsStandard: {
      query: ordsStandardQuery,
      loadingKey: 'loading',
      skip: true,
      // Optional result hook
      result() {
        this.isLoading = false;
      },
    },
    ecoCheques: {
      query: ordsEcoCheques,
      loadingKey: 'loading',
      skip: true,
      // Optional result hook
      result() {
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
    CategoryGroup,
  },
  provide() {
    return {
      $icons: this.$icons,
    };
  },
  props: {
    embed: {
      type: Boolean,
      default: () => false,
    },
    filter: {
      type: String,
      default: () => undefined,
    },
    useGeolocation: {
      type: Boolean,
      default: () => undefined,
    },
    defaultCenter: {
      type: Array,
      default: () => undefined,
    },
    defaultZoom: {
      type: Number,
      default: () => undefined,
    },
    locale: {
      type: String,
      default: () => undefined,
    },
    itemsPerPage: {
      type: Number,
      default: () => undefined,
    },
    showFilterButtons: {
      type: Boolean,
      default: () => undefined,
    },
    mapboxAccessToken: {
      type: String,
      default: () => undefined,
    },
    apiBaseUrl: {
      type: String,
      default: () => process.env.REPAIR_MAP_GRAPHQL_HTTP || 'https://ordp-api.vito.be/',
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
    ecoCheques: [],
    circufixCategoryGroups: [
      {
        code: 'electro',
        items: [
          'smartphones_tablets_computers',
          'tv_audio_video',
          'klein_huishoudelektro',
          'groot_huishoudelektro',
          'elektrisch_elektronisch_gereedschap',
          'speelgoed_vrijetijd_sportuitrusting',
          'andere_elektro',
        ],
      },
      {
        code: 'textile',
        items: ['textiel_kleding', 'schoenen_leder'],
      },
      {
        code: 'bicycle',
        items: ['gewone_fiets', 'e-bikes', 'steps'],
      },
      {
        code: 'jewellery_watches',
        items: ['juwelen_uurwerken'],
      },
      {
        code: 'furniture_flooring',
        items: ['meubels_vloerbekleding'],
      },
    ],
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
      ecocheques: [],
      location: null,
    },
    search: null,
    searchLocations: [],
    categoriesAllSelectedGroup: {},
    error: null,
  }),
  computed: {
    categoryColors() {
      return categoryColors;
    },
    showActiveFilters() {
      const { filters } = this;
      // const parentCategory = this.categories;
      return filters.organisation_types.length || filters.product_categories.length || filters.ecocheques.length;
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
            language: this.locale,
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
    locations() {
      this.updateMarkers();
    },
    currentPage() {
      this.scrollIntoView();
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
      this.toggleFilter(null);
      this.map.fitBounds([
        [bbox[1], bbox[0]],
        [bbox[3], bbox[2]],
      ]);
    },
  },
  created() {
    const apolloClient = new ApolloClient({
      // You should use an absolute URL here
      uri: this.apiBaseUrl,
    });
    this.$apollo.provider.clients.ordp = apolloClient;

    this.activeFilter = this.filter;
    this.debounceSearchLocations = debounce((query) => this.asyncSearchLocations(query), 1000);
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
    if ((this.useGeolocation || !params.bbox) && navigator.geolocation) {
      await this.askLocation();
    }

    this.isRendering = false;
    this.fetchLocations();
    this.fetchOrdsStandard();
    this.fetchEcoCheques();
  },
  methods: {
    fetchLocations() {
      this.$apollo.queries.locations.skip = this.shouldSkipOrdpQuery();
      this.$apollo.queries.locations.refetch();
      this.currentPage = 1;
    },
    fetchOrdsStandard() {
      this.$apollo.queries.ordsStandard.skip = false;
      this.$apollo.queries.ordsStandard.refetch();
    },
    fetchEcoCheques() {
      this.$apollo.queries.ecoCheques.skip = false;
      this.$apollo.queries.ecoCheques.refetch();
    },
    getCategoryCodesForGroup(groupCode) {
      let categoryCodes = [];
      this.circufixCategoryGroups
        .find(function (item) {
          return item.code === groupCode;
        })
        .items.forEach((category) => {
          categoryCodes.push(category);
        });

      return categoryCodes;
    },
    checkIfAllSelected() {
      const { filters } = this;
      // loop through the categoryGroups and check if the categories are all checked from this group
      for (const { code } of this.circufixCategoryGroups) {
        const categoryCodesForGroup = this.getCategoryCodesForGroup(code);
        this.categoriesAllSelectedGroup[code] =
          categoryCodesForGroup &&
          categoryCodesForGroup.length > 0 &&
          categoryCodesForGroup.every((code) => {
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

      this.map.on('moveend', this.mapMoveEnd());
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
        this.openLocation(this.activeLocation.id);
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
    asyncSearchLocations(query) {
      if (query) {
        this.search = query;
        this.isLoading = true;
        this.$apollo.queries.searchLocations.skip = false;
        this.$apollo.queries.searchLocations.refetch();
      }
    },
    selectSearchLocation(selectedOption) {
      this.toggleFilter(null);
      if (this.activeLocationId !== selectedOption.id) {
        this.closePopup();
      }
      this.map.flyTo(selectedOption.geometry.coordinates, this.map.getMaxZoom());

      this.activeLocationId = selectedOption.id;
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
        this.openLocation(location.id);
      }
    },
    openLocation(locationId) {
      this.map.off('moveend');
      if (this.markerClusterGroup.hasLayer(this.locationMarkers[locationId])) {
        this.markerClusterGroup.zoomToShowLayer(this.locationMarkers[locationId], () => {
          this.openPopup(locationId);
        });
      } else {
        this.openPopup(locationId);
      }
      this.map.on('moveend', this.mapMoveEnd());
    },
    mapMoveEnd() {
      return debounce(() => {
        !this.isRendering && this.fetchLocations();
      }, 500);
    },
    scrollIntoView() {
      this.$refs.pageContainer.$el.scrollIntoView({
        behavior: 'smooth',
      });
      this.$refs.listContainer.scrollIntoView({
        behavior: 'smooth',
      });
    },
    openPopup(locationId) {
      const marker = this.locationMarkers[locationId];
      if (marker) {
        marker.unbindPopup();
      }
      this.activeLocationId = locationId;
      if (marker) {
        marker
          .bindPopup(this.$refs.popup, {
            maxWidth: 350,
            closeButton: false,
          })
          .openPopup();
      }
    },
    shouldSkipOrdpQuery() {
      return !this.map || !this.locale;
    },
    closePopup() {
      this.activeLocationId = null;
      this.map.closePopup();
    },
  },
};
</script>

<style src="leaflet/dist/leaflet.css"></style>
<style src="leaflet.markercluster/dist/MarkerCluster.css"></style>
<style src="leaflet.markercluster/dist/MarkerCluster.Default.css"></style>
<style src="./assets/css/app.css"></style>
<style lang="css">
</style>
