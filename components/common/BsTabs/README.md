# BsTabs

Underline tabs for switching views inside a page (not primary nav).

```vue
<BsTabs
  v-model="tab"
  :tabs="[
    {value: 'all', label: '전체', count: 128},
    {value: 'active', label: '활성', count: 94},
    {value: 'archived', label: '보관'}
  ]"
/>
```

## Props

| Prop         | Type                                | Default |
| ------------ | ----------------------------------- | ------- |
| `modelValue` | `string`                            | `''`    |
| `tabs`       | `(string \| {value,label,count})[]` | `[]`    |

## Emits

- `update:modelValue(value)`

Keep to 2–6 tabs; beyond that use BsSelect or sidebar nav.
