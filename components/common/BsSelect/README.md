# BsSelect

Dropdown for one option from a short, known list.

```vue
<BsSelect
  v-model="role"
  label="역할"
  :options="[
    {value: 'admin', label: '관리자'},
    {value: 'editor', label: '편집자'}
  ]"
/>
```

## Props

| Prop                   | Type                          | Default      |
| ---------------------- | ----------------------------- | ------------ |
| `modelValue`           | `string`                      | `''`         |
| `label`                | `string`                      | —            |
| `options`              | `(string \| {value,label})[]` | `[]`         |
| `placeholder`          | `string`                      | `선택하세요` |
| `size`                 | `sm \| md \| lg`              | `md`         |
| `disabled` / `invalid` | `boolean`                     | `false`      |
| `hint`                 | `string`                      | —            |

## Emits

- `update:modelValue(value)`
