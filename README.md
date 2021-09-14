# Repair map

## Installation

```
yarn add git@github.com:statikbe/repair-map.git
```

Integrate with Vue:

In a `.vue` file:

```vue
<template>
  <repair-map />
</template>

<script>
import { RepairMap } from 'repair-map';

export default {
  components: {
    RepairMap,
  },
};
</script>
```

## Customization

### Filter triggers

To implement your own filter triggers, disable the default buttons with `:show-filter-buttons="false"`, then pass the `filter` prop:

```vue
<template>
  <button @click="activeFilter = 'TYPE'">Type</button>
  <button @click="activeFilter = 'CATEGORY'">Category</button>
  <button @click="activeFilter = 'LOCATION'">Location</button>
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
};
</script>
```

### Location title

To customize the location title (and optional URL), you can use the `locationTitle` slot, like so:

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

### Theme

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

Dark variants are used for things like hover states, contrast variants are used for things like button text.

## Props

| Prop              | Type    | Default               | Description                                                                                                                    |
| ----------------- | ------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| filter            | String  | `null`                | Filter that is currently active. To be used with custom filter buttons (see above)                                             |
| defaultCenter     | Array   | `[50.87959, 4.70093]` | The default coordinates that the map will center to when the user _does not_ provide his browser location. Defaults to Leuven. |
| locale            | String  | `null`                |                                                                                                                                |
| itemsPerPage      | Number  | `10`                  |                                                                                                                                |
| showFilterButtons | Boolean | `true`                |                                                                                                                                |
