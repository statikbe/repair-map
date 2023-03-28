# Repair map

## Implementation as an embed (iframe)

The easiest, but least configurable way to implement the Repair map component, is to use an embedded iframe. It's recommended to include [iframe-resizer](https://github.com/davidjbradshaw/iframe-resizer) in your application to handle proper resizing of the component.

Note: the `iframe` itself should span the entire the viewport width; so try not to place it inside a container.

Create an `iframe` and pass the embed URL with optional query parameters:

```
<iframe id="repair-map" src="https://mapping.sharepair.org/embed?lang=de&mapboxAccessToken=xxx" frameborder="0" style="width: 1px; min-width: 100%; min-height: 100vh;"></iframe>
<script src="https://unpkg.com/iframe-resizer@4.3.2/js/iframeResizer.min.js"></script>
<script>
  iFrameResize({}, '#repair-map');
</script>
```

Passing the `lang` parameter is recommended to display the component in your webpage's language (will default to English)
You can also provide your own `mapboxAccessToken` parameter to enable the location filter.

It's also possible to pass [some options](https://github.com/davidjbradshaw/iframe-resizer/blob/master/docs/parent_page/options.md) to the iframe resizer.

## Implementation as a Vue component

The recommended way to implement the Repair map component, allows the most flexibility and customizability.

### Installation

```
yarn add @statikbe/repair-map
```

Integrate with Vue:

```javascript
import Vue from 'vue';
import RepairMapPlugin from 'repair-map';
import { i18n } from 'repair-map';

Vue.use(RepairMapPlugin);

new Vue({ i18n });
```

### Customization

#### Filter triggers

To implement your own filter triggers, disable the default buttons with `:show-filter-buttons="false"`, then pass the `filter` prop:

```vue
<template>
  <button @click="setActiveFilter('TYPE')">Type</button>
  <button @click="setActiveFilter('CATEGORY')">Category</button>
  <button @click="setActiveFilter('LOCATION')">Location</button>
  <repair-map :show-filter-buttons="false" :filter="activeFilter" @filter-close="activeFilter = null" />
</template>

<script>
import RepairMap from 'repair-map';

export default {
  components: {
    RepairMap,
  },
  data: () => ({
    activeFilter: null,
  }),
  methods: {
    setActiveFilter(filter) {
      this.activeFilter = filter;
    },
  },
};
</script>
```

#### Location title

To customize the location title (and optionally, the URL), you can use the `locationTitle` slot, like so:

```vue
<template>
  <repair-map>
    <template #locationTitle="{ name, id, defaultClass }">
      <a :href="`https://my-custom-url.com/location/${id}`" :class="defaultClass">
        <span>{{ name }}</span>
        <r-icon name="mdiChevronRight" />
      </a>
    </template>
  </repair-map>
</template>

<script>
import { RIcon } from '@statikbe/repair-components';
import RepairMap from 'repair-map';

export default {
  components: {
    RepairMap,
    RIcon,
  },
};
</script>
```

This will be applied to the list items as well as the Leaflet popups.

#### Theme

To change the theme to match your own brand, simply change these CSS variables:

```css
:root {
  --repair-primary: #71b8c5;
  --repair-primary-dark: #5a939d;
  --repair-primary-contrast: white;

  --repair-secondary: #9c7a97;
  --repair-secondary-dark: #7c6178;
  --repair-secondary-contrast: white;
}
```

Dark variants are used for hover states, contrast variants are used for button text etc.

### Props

| Prop              | Type    | Default               | Description                                                                                                                                               |
| ----------------- | ------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| filter            | String  | `null`                | Filter that is currently active. To be used with custom filter buttons (see above)                                                                        |
| defaultCenter     | Array   | `[50.87959, 4.70093]` | The default coordinates that the map will center to on load. Defaults to Leuven. If this prop is provided, the user location will not be asked.           |
| defaultZoom       | Number  | `14`                  | The default zoom level of the map.                                                                                                                        |
| locale            | String  | `null`                | The preferred language of the interface. Currently only `en`, `fr`, `de` and `nl` are supported.                                                          |
| itemsPerPage      | Number  | `10`                  | Number of initiative results per page.                                                                                                                    |
| showFilterButtons | Boolean | `true`                | Set to false to implement your own filter buttons.                                                                                                        |
| mapboxAccessToken | String  | `null`                | Providing a [Mapbox access token](https://docs.mapbox.com/help/getting-started/access-tokens/) will enable searching for locations to center your map to. |

### URL Parameters

| Parameter         | Type    | Description                                                                                                                                               |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| organisation_types            | Array  | Parameter for prefiltering the map using the repair API. All the organisation codes can be found [here](https://www.repairconnects.org/api/v1/organisation_types). Example: `organisation_types[]=professional_repairer&organisation_types[]=fablab`                                                                      |
| product_categories     | Array  | Parameter for prefiltering the map using the repair API. All the product codes can be found [here](https://www.repairconnects.org/api/v1/product_categories).           |
| bbox       | Array  | Parameter for prefiltering the map using the repair API. Example: `bbox=51.15313203444604%2C4.400453567504884%2C51.22075494571333%2C4.470491409301759`       |

## For developers

You can fetch data from two API's.
The [ORDP API](https://ordp.datascienceinstitute.ie/) (**default**) and the [Repair Connects API](https://www.repairconnects.org/api/v1/documentation).
You can switch easily by updating your environment variables (f.e. in a .env file).

```dotenv
REPAIR_MAP_SOURCE='ordp'
#OR
REPAIR_MAP_SOURCE='repair'
```

In the `components` folder there are two folders, one for ORDP and one for the repair.
When fetching data from ORDP, GraphQL and Apollo is used. See the `graphql` folder for the query.

### Publishing to NPM

First, run `yarn build` to build this package as a library.

To publish this package to the NPM registry, make sure you are logged in with statikbe credentials (see 1pw) using `npm login`, then run `npx np --no-2fa`. Respect the [semantic versioning](https://semver.org/) guidelines when doing so!
