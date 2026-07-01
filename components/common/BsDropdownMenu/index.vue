<script setup lang="ts">
import './index.style.scss'
import {computed, onBeforeUnmount, ref, watch} from 'vue'
import type {BsDropdownMenuProps, BsMenuItem} from './index.type'

const props = withDefaults(defineProps<BsDropdownMenuProps>(), {
  items: () => [],
  align: 'start',
  width: 200
})

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function onDoc(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
watch(open, (v) => {
  if (v) {
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
  } else {
    document.removeEventListener('mousedown', onDoc)
    window.removeEventListener('keydown', onKey)
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDoc)
  window.removeEventListener('keydown', onKey)
})

const menuStyle = computed(() => ({'--bs-dropdown-width': `${props.width}px`}))

function run(it: BsMenuItem) {
  open.value = false
  it.onClick?.()
}
</script>

<template>
  <div ref="root" class="bs-dropdown">
    <span class="bs-dropdown__trigger" @click="open = !open"><slot name="trigger" /></span>
    <div v-if="open" :class="['bs-dropdown__menu', `bs-dropdown__menu--${align}`]" :style="menuStyle" role="menu">
      <template v-for="(it, i) in items" :key="i">
        <div v-if="it.divider" class="bs-dropdown__divider" />
        <div v-else-if="it.heading" class="bs-dropdown__heading">{{ it.label }}</div>
        <button
          v-else
          role="menuitem"
          :class="['bs-dropdown__item', {'bs-dropdown__item--danger': it.tone === 'danger'}]"
          @click="run(it)"
        >
          <span v-if="it.icon" class="bs-dropdown__icon" v-html="it.icon" />
          <span class="bs-dropdown__label">{{ it.label }}</span>
          <kbd v-if="it.shortcut" class="bs-dropdown__shortcut">{{ it.shortcut }}</kbd>
        </button>
      </template>
    </div>
  </div>
</template>
