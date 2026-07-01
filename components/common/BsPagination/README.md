# BsPagination

Page navigator for tables and lists. Auto-truncates long ranges with ellipses.

```vue
<BsPagination v-model="page" :total="24" />
```

## Props

| Prop         | Type                 | Default |
| ------------ | -------------------- | ------- |
| `modelValue` | `number` (1-indexed) | `1`     |
| `total`      | `number`             | `1`     |

## Emits

- `update:modelValue(page)`

Pair with a "N개 중 X–Y 표시" count label on the other side of the table footer.
