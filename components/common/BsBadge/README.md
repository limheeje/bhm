# BsBadge

Compact pill for status, category, or count.

```vue
<BsBadge tone="success" dot>활성</BsBadge>
<BsBadge tone="warning">검토 대기</BsBadge>
<BsBadge tone="neutral" size="sm">v2.4</BsBadge>
```

## Props

| Prop   | Type                                                       | Default   |
| ------ | ---------------------------------------------------------- | --------- |
| `tone` | `neutral \| brand \| success \| warning \| danger \| info` | `neutral` |
| `dot`  | `boolean`                                                  | `false`   |
| `size` | `sm \| md`                                                 | `md`      |

## Slots

- **default** — label
