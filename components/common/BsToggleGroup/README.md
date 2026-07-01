# BsToggleGroup

Segmented control for one of 2–5 mutually-exclusive options (view mode, range, quick filter).

```vue
<BsToggleGroup
  v-model="view"
  :options="[
    {value: 'list', label: '목록'},
    {value: 'board', label: '보드'},
    {value: 'cal', label: '캘린더'}
  ]"
/>
```

## Props

| Prop         | Type                          | Default |
| ------------ | ----------------------------- | ------- |
| `modelValue` | `string`                      | `''`    |
| `options`    | `(string \| {value,label})[]` | `[]`    |
| `size`       | `sm \| md \| lg`              | `md`    |
| `fullWidth`  | `boolean`                     | `false` |

## Emits

- `update:modelValue(value)`

Use over BsTabs when it's a control/filter, not page navigation.
