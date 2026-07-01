# BsInput

Single-line text field with label, hint, and error states.

```vue
<BsInput v-model="email" label="이메일" placeholder="name@company.com" />
<BsInput v-model="pw" label="비밀번호" type="password" invalid error-text="8자 이상 입력하세요" />
<BsInput v-model="q" placeholder="검색"><template #lead><SearchIcon :size="15" /></template></BsInput>
```

## Props

| Prop          | Type             | Default |
| ------------- | ---------------- | ------- |
| `modelValue`  | `string`         | `''`    |
| `label`       | `string`         | —       |
| `placeholder` | `string`         | —       |
| `type`        | `string`         | `text`  |
| `size`        | `sm \| md \| lg` | `md`    |
| `disabled`    | `boolean`        | `false` |
| `invalid`     | `boolean`        | `false` |
| `hint`        | `string`         | —       |
| `errorText`   | `string`         | —       |

## Slots

- **lead** / **trail** — icon nodes inside the field

## Emits

- `update:modelValue(value)`, `focus`, `blur`
