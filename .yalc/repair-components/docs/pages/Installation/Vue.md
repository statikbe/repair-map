# Vue

## Installation

You can either install the full component library:

```js
import RepairComponents from 'repair-components';

Vue.use(RepairComponents, {
  // options (see below)
});
```

...or import only the specific components you need:

```vue
<script>
import { RButton, RSection } from 'repair-components';

export default {
  components: {
    RButton,
    RSection,
  },
};
</script>
```

<!-- ## Options

### `prefix`

Some Repair components could be embedded in another website. To avoid styling conflicts, you can configure a prefix:

```js
Vue.use(ComponentLibrary {
    prefix: 'r-'
});
```

Make sure to configure the same prefix in your `tailwind.config.js` as well.

The component library creates a global `$prefix` function to manage prefixing your classes:

```html
<button :class="$prefix('inline-block px-4 py-2')"></button>
```

results in

```html
<button class="r-inline-block r-px-4 r-py-2"></button>
``` -->
