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
import RepairMap from 'repair-map';

export default {
  components: {
    RepairMap,
  },
};
</script>
```

## Customization

### Default locations

This will add a radio button labeled "Leuven" to the location filters:

```vue
<template>
  <repair-map :default-locations="defaultLocations" />
</template>

<script>
import RepairMap from 'repair-map';

export default {
  components: {
    RepairMap,
  },
  computed: {
    defaultLocations() {
      return [
        {
          name: 'Leuven',
          bbox: [50.824177, 4.640198, 50.943362, 4.772457],
        },
      ];
    },
  },
};
</script>
```

The `bbox` will be contained within the map when filtering.

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
import RepairMap from 'repair-map';

export default {
  components: {
    RepairMap,
  },
};
</script>
```

This will be applied to the list items as well as the Leaflet popups.
