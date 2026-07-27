<script setup lang="ts">
import './index.style.scss'
import StringUtil from '~/utils/StringUtil'
import type {BsInputFileProps} from '~/components/common/index'
import AppIcon from '~/app/AppIcon/index.vue'

//const localId = StringUtil.uniqueId()
const props = withDefaults(defineProps<BsInputFileProps>(), {
  id: '',
  name: ''
})
const localId = ref('')
const localName = ref('')
const emits = defineEmits(['change'])

onMounted(async () => {
  await nextTick()
  localId.value = props.id ?? StringUtil.uniqueId()
  localName.value = props.name ?? localId.value
})

function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  console.log('target.files----', target.files)
  emits('change', e)
}
</script>

<template>
  <div class="bs-input-file">
    <input :id="localId" type="file" class="c-inp" @change="onChange" />
    <label :for="localId" class="c-label">
      <div class="c-ins">
        <AppIcon name="refresh" :size="50" />
      </div>
    </label>
  </div>
</template>
