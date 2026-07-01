# BsToastProvider

Wrap your layout once to enable `useToast()`. Renders the fixed, animated toast stack (teleported to `<body>`).

```vue
<!-- layouts/default.vue -->
<script setup lang="ts">
import BsToastProvider from '~/components/BsToastProvider/index.vue'
</script>
<template>
  <BsToastProvider placement="bottom-center"><slot /></BsToastProvider>
</template>
```

Then anywhere below it:

```ts
import {useToast} from '~/lumo/vue/composables/useToast'
const toast = useToast()
toast({tone: 'success', title: '저장되었습니다'})
```

## Props

| Prop        | Type                                         | Default         |
| ----------- | -------------------------------------------- | --------------- |
| `placement` | `bottom-center \| bottom-right \| top-right` | `bottom-center` |

`toast(opts)` accepts `{ tone, title, message, duration }` — `duration: 0` keeps it until dismissed.
