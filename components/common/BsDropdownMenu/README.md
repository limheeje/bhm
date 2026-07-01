# BsDropdownMenu

Popover menu for row actions, overflow (⋯) buttons, and account menus. Closes on outside click + Escape.

```vue
<BsDropdownMenu
  align="end"
  :items="[
    {label: '계정', heading: true},
    {label: '편집', onClick: edit},
    {label: '복제', shortcut: '⌘D'},
    {divider: true},
    {label: '삭제', tone: 'danger', onClick: remove}
  ]"
>
  <template #trigger>
    <BsIconButton aria-label="더보기"><MoreIcon :size="18" /></BsIconButton>
  </template>
</BsDropdownMenu>
```

## Props

| Prop    | Type           | Default |
| ------- | -------------- | ------- |
| `items` | `BsMenuItem[]` | `[]`    |
| `align` | `start \| end` | `start` |
| `width` | `number` (px)  | `200`   |

## Item kinds

normal · `heading` (section label) · `divider` · `tone:'danger'`. Item `icon` is an HTML string (rendered via `v-html`) — pass an inline `<svg>…</svg>` string.

## Slots

- **trigger** — the clickable element
