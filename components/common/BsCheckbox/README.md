# BsCheckbox

Boolean toggle for multi-select and form fields. Use `indeterminate` for "some selected" headers.

```vue
<BsCheckbox v-model="agree" label="약관에 동의합니다" />
<BsCheckbox :model-value="false" indeterminate @update:model-value="toggleAll" />
```

## Props

| Prop            | Type      | Default |
| --------------- | --------- | ------- |
| `modelValue`    | `boolean` | `false` |
| `indeterminate` | `boolean` | `false` |
| `label`         | `string`  | —       |
| `disabled`      | `boolean` | `false` |

## Emits

- `update:modelValue(value)`
