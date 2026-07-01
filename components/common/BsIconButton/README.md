# BsIconButton

Square, icon-only action for toolbars and table-row controls. Always pass `ariaLabel`.

```vue
<BsIconButton aria-label="편집" variant="ghost"><EditIcon :size="18" /></BsIconButton>
<BsIconButton aria-label="더보기" variant="secondary" size="sm"><MoreIcon :size="16" /></BsIconButton>
```

## Props

| Prop        | Type                            | Default      |
| ----------- | ------------------------------- | ------------ |
| `variant`   | `ghost \| secondary \| primary` | `ghost`      |
| `size`      | `sm \| md \| lg`                | `md`         |
| `ariaLabel` | `string`                        | — (required) |
| `disabled`  | `boolean`                       | `false`      |

## Slots

- **default** — the icon node

## Emits

- `click(event: MouseEvent)`
