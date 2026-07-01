# BsCard

Surface container grouping related content, with optional header/footer.

```vue
<BsCard title="최근 주문" subtitle="지난 7일">
  <template #actions><BsButton size="sm" variant="ghost">전체 보기</BsButton></template>
  …내용…
  <template #footer>5건 표시 중</template>
</BsCard>
```

## Props

| Prop       | Type               | Default |
| ---------- | ------------------ | ------- |
| `title`    | `string`           | —       |
| `subtitle` | `string`           | —       |
| `padding`  | `none \| sm \| md` | `md`    |

## Slots

- **default** — body
- **actions** — header action nodes
- **footer** — muted footer bar

Use `padding="none"` when embedding a full-bleed table.
