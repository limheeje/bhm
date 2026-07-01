# BsSwitch

On/off toggle for instant-apply settings. Use over BsCheckbox when the change applies immediately.

```vue
<BsSwitch v-model="emailOn" label="이메일 알림" />
<BsSwitch v-model="maintenance" size="sm" />
```

## Props

| Prop         | Type       | Default |
| ------------ | ---------- | ------- |
| `modelValue` | `boolean`  | `false` |
| `label`      | `string`   | —       |
| `size`       | `sm \| md` | `md`    |
| `disabled`   | `boolean`  | `false` |

## Emits

- `update:modelValue(value)`
