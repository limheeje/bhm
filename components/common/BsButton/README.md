# BsButton

Primary action control. Use for the single most important action in a view, group, or form.

```vue
<script setup lang="ts">
import BsButton from '~/components/BsButton/index.vue'
</script>

<template>
  <BsButton variant="primary" @click="save">저장</BsButton>
  <BsButton variant="secondary"
    ><template #lead><PlusIcon :size="16" /></template>새 항목</BsButton
  >
  <BsButton variant="ghost" size="sm">취소</BsButton>
  <BsButton variant="danger">삭제</BsButton>
</template>
```

## Props

| Prop        | Type                                                     | Default   |
| ----------- | -------------------------------------------------------- | --------- |
| `variant`   | `primary \| secondary \| ghost \| danger \| danger-soft` | `primary` |
| `size`      | `sm \| md \| lg`                                         | `md`      |
| `disabled`  | `boolean`                                                | `false`   |
| `fullWidth` | `boolean`                                                | `false`   |
| `type`      | `button \| submit \| reset`                              | `button`  |

## Slots

- **default** — label
- **lead** / **trail** — 16px icon nodes before/after the label

## Emits

- `click(event: MouseEvent)`

## Notes

- One `primary` per view. `danger` is a solid destructive action; `danger-soft` is the tinted variant.
- Hover/active/focus are pure CSS states in `index.style.scss` — no JS state.
