# BsToast

Single notification surface. Usually rendered for you by `BsToastProvider` + `useToast()`, but can be placed directly for static demos.

```vue
<BsToast tone="success" title="저장되었습니다" message="모든 기기에 적용되었어요." @close="..." />
```

## Props

| Prop       | Type                                              | Default   |
| ---------- | ------------------------------------------------- | --------- |
| `tone`     | `success \| danger \| warning \| info \| neutral` | `neutral` |
| `title`    | `string`                                          | —         |
| `message`  | `string`                                          | —         |
| `closable` | `boolean`                                         | `true`    |

## Emits

- `close`

`neutral` renders the dark inverse surface; the others are white cards with a colored left bar.
