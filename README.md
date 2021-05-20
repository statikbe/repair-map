# Repair map

## Installation

```
yarn add git@github.com:statikbe/repair-map.git
```

Integrate with Vue:

In a .vue file:

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

### Filter triggers

```vue
<template>
  <button @click="activeFilter = 'TYPE'">Type</button>
  <button @click="activeFilter = 'CATEGORY'">Category</button>
  <button @click="activeFilter = 'LOCATION'">Location</button>
  <repair-map :show-filter-buttons="false" @filter-close="activeFilter = null" />
</template>

<script>
import RepairMap from 'repair-map';

export default {
  components: {
    RepairMap,
  },
  data: () => ({
    activeFilter: 'TYPE',
  }),
};
</script>
```

### Location title + URL

```vue
<template>
  <repair-map :show-filter-buttons="false" @filter-close="activeFilter = null">
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
