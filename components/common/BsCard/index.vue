<script setup lang="ts">
import './index.style.scss'
import {useSlots} from 'vue'
import type {BsCardProps} from './index.type'

const props = withDefaults(defineProps<BsCardProps>(), {
  padding: 'md'
})
const slots = useSlots()
</script>

<template>
  <section class="bs-card">
    <header v-if="title || slots.actions" class="bs-card__header">
      <div class="bs-card__heading">
        <div v-if="title" class="bs-card__title">{{ title }}</div>
        <div v-if="subtitle" class="bs-card__subtitle">{{ subtitle }}</div>
      </div>
      <div v-if="slots.actions" class="bs-card__actions"><slot name="actions" /></div>
    </header>

    <div :class="['bs-card__body', `bs-card__body--${props.padding}`]"><slot /></div>

    <footer v-if="slots.footer" class="bs-card__footer"><slot name="footer" /></footer>
  </section>
</template>
