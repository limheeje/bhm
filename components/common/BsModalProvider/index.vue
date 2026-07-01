<script setup lang="ts">
import {BsModal, BsButton} from '~/components/common'
import {provideModal} from '~/composables/useModal'

const state = provideModal()
</script>

<template>
  <slot />
  <BsModal
    v-model="state.isOpen"
    :title="state.options.title"
    :description="state.options.description"
    :size="state.options.size"
    :close-on-overlay="state.options.closeOnOverlay"
    @close="state.options.onClose?.()"
  >
    <component :is="state.options.component" v-bind="state.options.componentProps" />

    <template v-if="state.options.buttons?.length" #footer>
      <BsButton
        v-for="(btn, i) in state.options.buttons"
        :key="i"
        :variant="btn.style?.variant"
        :size="btn.style?.size"
        :disabled="btn.style?.disabled"
        :full-width="btn.style?.fullWidth"
        @click="btn.callback?.()"
      >
        {{ btn.label }}
      </BsButton>
    </template>
  </BsModal>
</template>
