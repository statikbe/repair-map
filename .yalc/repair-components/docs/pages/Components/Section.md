# Section

## Examples

### Default section

<r-app>
<r-section>Default section</r-section>
</r-app>

```vue
<r-section>
    Default section
<r-section/>
```

### Colored sections

<r-app>
<r-section color="primary">Primary section</r-section>
<br/>
<r-section color="secondary">Secondary section</r-section>
</r-app>

```vue
<r-section>
    Primary section
</r-section>
```

```vue
<r-section>
    Secondary section
</r-section>
```

### Using contrast buttons with colored sections

<r-app>
<r-section color="primary">
<r-button contrast>Read more</r-button>
</r-section>
<br/>
<r-section color="secondary">
<r-button color="secondary" contrast>Read more</r-button>
</r-section>
</r-app>

```vue
<r-section color="primary">
    <r-button contrast>Read more</r-button>
</r-section>
```

```vue
<r-section color="secondary">
    <r-button color="secondary" contrast>Read more</r-button>
</r-section>
```

### Size

<r-app>
<r-section color="primary" size="sm">Small</r-section>
<br/>
<r-section color="primary" size="md">Medium (default)</r-section>
<br/>
<r-section color="primary" size="lg">Large</r-section>
</r-app>

```vue
<r-section color="primary" size="sm">
    Small
</r-section>
```

```vue
<r-section color="primary" size="md">
    Medium (default)
</r-section>
```

```vue
<r-section color="primary" size="lg">
    Large
</r-section>
```

<div class="api">

## API

### Props

| Name | Type | Default |     |
| ---- | ---- | ------- | --- |
|      |      |         |     |

### Events

| Name | Type | Default |     |
| ---- | ---- | ------- | --- |
|      |      |         |     |

### Slots

| Name | Type | Default |     |
| ---- | ---- | ------- | --- |
|      |      |         |     |

</div>
