/**
 * @description import { BsButton, BsBadge, useToast } from '~/components/common/index'
 * @description import type { BsSwitchProps, BsBadgeProps, BsAvatarProps } from '~/components/common/index'
 *
 */
//<script setup lang="ts">
//  import { useToast } from '~/components/common/index'
//  const toast = useToast()
//  function onSave() {
//    toast({ tone: 'success', title: '저장 완료', message: '데이터가 저장됐어요.' })
//  }
//</script>

export {default as BsButton} from '~/components/common/BsButton/index.vue'
export {default as BsIconButton} from '~/components/common/BsIconButton/index.vue'
export {default as BsInput} from '~/components/common/BsInput/index.vue'
export {default as BsSelect} from '~/components/common/BsSelect/index.vue'
export {default as BsCheckbox} from '~/components/common/BsCheckbox/index.vue'
export {default as BsSwitch} from '~/components/common/BsSwitch/index.vue'
export {default as BsBadge} from '~/components/common/BsBadge/index.vue'
export {default as BsAvatar} from '~/components/common/BsAvatar/index.vue'
export {default as BsCard} from '~/components/common/BsCard/index.vue'
export {default as BsTabs} from '~/components/common/BsTabs/index.vue'
export {default as BsToggleGroup} from '~/components/common/BsToggleGroup/index.vue'
export {default as BsPagination} from '~/components/common/BsPagination/index.vue'
export {default as BsModal} from '~/components/common/BsModal/index.vue'
export {default as BsModalProvider} from '~/components/common/BsModalProvider/index.vue'
export {default as BsDropdownMenu} from '~/components/common/BsDropdownMenu/index.vue'
export {default as BsToast} from '~/components/common/BsToast/index.vue'
export {default as BsToastProvider} from '~/components/common/BsToastProvider/index.vue'

export * from '~/components/common/BsButton/index.type'
export * from '~/components/common/BsIconButton/index.type'
export * from '~/components/common/BsInput/index.type'
export * from '~/components/common/BsSelect/index.type'
export * from '~/components/common/BsCheckbox/index.type'
export * from '~/components/common/BsSwitch/index.type'
export * from '~/components/common/BsBadge/index.type'
export * from '~/components/common/BsAvatar/index.type'
export * from '~/components/common/BsCard/index.type'
export * from '~/components/common/BsTabs/index.type'
export * from '~/components/common/BsToggleGroup/index.type'
export * from '~/components/common/BsPagination/index.type'
export * from '~/components/common/BsModal/index.type'
export * from '~/components/common/BsDropdownMenu/index.type'
export * from '~/components/common/BsToast/index.type'

export {useToast, provideToast, LUMO_TOAST_KEY} from '~/composables/useToast'
export type {ToastTone, ToastOptions, ToastItem, ToastPush} from '~/composables/useToast'

export {useModal, provideModal, BS_MODAL_KEY} from '~/composables/useModal'
export type {ModalOptions, ModalController, ModalProviderState} from '~/composables/useModal'
