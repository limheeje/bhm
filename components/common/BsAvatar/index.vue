<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import type {BsAvatarProps} from './index.type'
import {BS_AVATAR_SIZES, BS_AVATAR_HUES, BS_AVATAR_STATUS_COLORS, initialsFromName, hueIndex} from './index.constant'

const props = withDefaults(defineProps<BsAvatarProps>(), {
  name: '',
  size: 'md'
})

const dim = computed(() => BS_AVATAR_SIZES[props.size] ?? 36)
const initials = computed(() => initialsFromName(props.name))
const hue = computed(() => BS_AVATAR_HUES[hueIndex(props.name)])
const statusColor = computed(() => (props.status ? BS_AVATAR_STATUS_COLORS[props.status] : ''))

const rootStyle = computed(() => ({
  '--bs-avatar-size': `${dim.value}px`,
  '--bs-avatar-font': `${Math.round(dim.value * 0.38)}px`,
  '--bs-avatar-status': `${Math.max(8, dim.value * 0.28)}px`,
  '--bs-avatar-bg': props.src ? 'var(--neutral-100)' : hue.value.bg,
  '--bs-avatar-fg': hue.value.fg,
  '--bs-avatar-status-color': statusColor.value
}))
</script>

<template>
  <span class="bs-avatar" :style="rootStyle">
    <span class="bs-avatar__face">
      <img v-if="src" class="bs-avatar__img" :src="src" :alt="name" />
      <template v-else>{{ initials }}</template>
    </span>
    <span v-if="statusColor" class="bs-avatar__status" />
  </span>
</template>
