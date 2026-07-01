<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import BsToast from '../BsToast/index.vue'
import {provideToast} from '~/composables/useToast'
import type {BsToastProviderProps} from './index.type'

const props = withDefaults(defineProps<BsToastProviderProps>(), {
  placement: 'bottom-center'
})

const {items, dismiss} = provideToast()

const stackClass = computed(() => ['bs-toast-stack', `bs-toast-stack--${props.placement}`])
</script>

<template>
  <slot />
  <Teleport to="body">
    <div :class="stackClass">
      <TransitionGroup name="bs-toast">
        <div v-for="t in items" :key="t.id" class="bs-toast-stack__item">
          <BsToast :tone="t.tone" :title="t.title" :message="t.message" @close="dismiss(t.id)" />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
