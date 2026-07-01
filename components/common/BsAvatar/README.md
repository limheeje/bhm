# BsAvatar

User avatar with image or deterministic initials/color fallback, plus optional presence dot.

```vue
<BsAvatar name="김민준" status="online" />
<BsAvatar name="Sarah Lee" src="/u/sarah.jpg" size="lg" />
```

## Props

| Prop     | Type                                | Default |
| -------- | ----------------------------------- | ------- |
| `name`   | `string`                            | `''`    |
| `src`    | `string`                            | —       |
| `size`   | `xs \| sm \| md \| lg \| xl`        | `md`    |
| `status` | `online \| away \| busy \| offline` | —       |

## Notes

Size/color are passed to the SCSS as CSS custom properties (`--bs-avatar-*`) set on the root, so the stylesheet stays declarative while diameter/hue are computed in `index.constant.ts`.
