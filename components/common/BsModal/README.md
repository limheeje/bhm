# BsModal

Centered dialog with overlay; closes on overlay click and Escape. Teleports to `<body>`.

```vue
<BsModal v-model="open" title="사용자 삭제" description="이 작업은 되돌릴 수 없습니다.">
  정말로 이 사용자를 삭제하시겠습니까?
  <template #footer>
    <BsButton variant="secondary" @click="open = false">취소</BsButton>
    <BsButton variant="danger" @click="remove">삭제</BsButton>
  </template>
</BsModal>
```

## Props

| Prop             | Type             | Default |
| ---------------- | ---------------- | ------- |
| `modelValue`     | `boolean`        | `false` |
| `title`          | `string`         | —       |
| `description`    | `string`         | —       |
| `size`           | `sm \| md \| lg` | `md`    |
| `closeOnOverlay` | `boolean`        | `true`  |

## Slots

- **default** — body, **footer** — action buttons

## Emits

- `update:modelValue(open)`, `close`
