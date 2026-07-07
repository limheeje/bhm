# BsSkeleton

Shimmering placeholder block for loading states. Compose several to mimic the real content's shape (see `components/balance/TransactionList/TransactionListSkeleton.vue` for an example).

```vue
<BsSkeleton width="55%" height="14px" />
<BsSkeleton circle width="34px" height="34px" />
```

## Props

| Prop     | Type               | Default             |
| -------- | ------------------ | -------------------- |
| `width`  | `string \| number` | `'100%'`             |
| `height` | `string \| number` | `'14px'`              |
| `radius` | `string`           | `'var(--radius-sm)'` |
| `circle` | `boolean`          | `false`               |

Numbers are treated as px. Use `circle` for avatars/icon placeholders instead of setting `radius` manually.
