# Lumo Admin — Vue 3 + TypeScript component library (`Bs` prefix)

Folder-per-component library for Nuxt 3 / Vue 3. **Pure component and styling are fully separated**: `index.vue` contains _no_ `<style>` block — every rule lives in `index.style.scss`, which the component imports as a side-effect.

## Folder convention

```
components/
  BsButton/
    index.vue            ← pure component (script + template only, NO <style>)
    index.type.ts        ← prop / emit / option types
    index.style.scss     ← styles, all values via design tokens (var(--…))
    index.constant.ts    ← defaults & static maps (only when needed)
    README.md            ← usage notes
```

`index.vue` wires styles in with a side-effect import:

```ts
import './index.style.scss'
```

so the SFC stays style-free while the styles still travel with the component (and tree-shake when unused).

## Setup in Nuxt 3

1. Load the design tokens once. Copy `styles.css` + `tokens/` into the app and register it:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/lumo/styles.css']
})
```

The component SCSS reads those tokens at runtime via `var(--…)`, so nothing else is needed. Make sure `sass` is installed (`npm i -D sass`).

2. Import components by folder:

```vue
<script setup lang="ts">
import BsButton from '~/components/BsButton/index.vue'
import BsBadge from '~/components/BsBadge/index.vue'
// or via the barrel:
// import { BsButton, BsBadge } from '~/lumo/vue'
</script>

<template>
  <BsButton variant="primary" @click="save">저장</BsButton>
  <BsBadge tone="success" dot>활성</BsBadge>
</template>
```

## Styling rules

- **No CSS-in-JS, no inline `:style` for theming.** State (hover / active / focus / disabled) is expressed with CSS pseudo-classes and BEM modifier classes (`.bs-button--primary`, `.bs-button--lg`) in the `.scss`.
- **All values come from tokens** — colors, type, spacing, radius, shadow are `var(--…)` references, so light/dark theming is automatic (`<html data-theme="dark">`).
- Class names are BEM under a `bs-` namespace to avoid global collisions (styles are intentionally **not** `scoped`, so they can be overridden/extended at the app level).

## Toasts

```vue
<!-- layouts/default.vue -->
<script setup lang="ts">
import BsToastProvider from '~/components/BsToastProvider/index.vue'
</script>
<template>
  <BsToastProvider><slot /></BsToastProvider>
</template>
```

```ts
import {useToast} from '~/lumo/vue/composables/useToast'
const toast = useToast()
toast({tone: 'success', title: '저장되었습니다'})
```

## Components

BsButton · BsIconButton · BsInput · BsSelect · BsCheckbox · BsSwitch · BsBadge · BsAvatar · BsCard · BsTabs · BsToggleGroup · BsPagination · BsModal · BsDropdownMenu · BsToast · BsToastProvider

Icons are passed via slots — use `lucide-vue-next` (1.8px stroke) to match the brand.
