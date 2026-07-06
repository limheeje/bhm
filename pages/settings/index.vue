<script setup lang="ts">
import './index.style.scss'
import {reactive, ref} from 'vue'
import {BsCard, BsAvatar, BsInput, BsSwitch, BsButton} from '~/components/common'

// const toast = useToast()

const name = ref('정하준')
const email = ref('hajun.jung@lumo.io')

const prefs = reactive({
  emailNotif: true,
  pushNotif: false,
  weekly: true,
  twofa: true,
  maintenance: false
})

const notifFields = [
  {key: 'emailNotif', label: '이메일 알림', hint: '중요한 업데이트를 이메일로 받습니다'},
  {key: 'pushNotif', label: '푸시 알림', hint: '브라우저 푸시 알림을 받습니다'},
  {key: 'weekly', label: '주간 리포트', hint: '매주 월요일 요약 리포트를 받습니다'}
] as const
const securityFields = [
  {key: 'twofa', label: '2단계 인증', hint: '로그인 시 추가 인증을 요구합니다'},
  {key: 'maintenance', label: '유지보수 모드', hint: '관리자를 제외한 접근을 차단합니다'}
] as const

function save() {
  // toast.open({title: '설정이 저장되었습니다'})
}
</script>

<template>
  <div class="settings">
    <h2 class="settings__h2">설정</h2>
    <p class="settings__sub">워크스페이스 환경설정을 관리하세요</p>

    <div class="settings__stack">
      <BsCard title="프로필">
        <div class="settings__profile">
          <BsAvatar name="정하준" size="xl" status="online" />
          <div class="settings__profile-meta">
            <div class="settings__profile-name">정하준</div>
            <div class="settings__profile-mail">hajun.jung@lumo.io · 관리자</div>
          </div>
          <BsButton variant="secondary" size="sm">사진 변경</BsButton>
        </div>
        <div class="settings__grid">
          <BsInput v-model="name" label="이름" />
          <BsInput v-model="email" label="이메일" />
        </div>
      </BsCard>

      <BsCard title="알림">
        <div v-for="f in notifFields" :key="f.key" class="settings__field">
          <div>
            <div class="settings__field-label">{{ f.label }}</div>
            <div class="settings__field-hint">{{ f.hint }}</div>
          </div>
          <BsSwitch v-model="prefs[f.key]" />
        </div>
      </BsCard>

      <BsCard title="보안">
        <div v-for="f in securityFields" :key="f.key" class="settings__field">
          <div>
            <div class="settings__field-label">{{ f.label }}</div>
            <div class="settings__field-hint">{{ f.hint }}</div>
          </div>
          <BsSwitch v-model="prefs[f.key]" />
        </div>
      </BsCard>

      <div class="settings__foot">
        <BsButton variant="secondary">취소</BsButton>
        <BsButton @click="save">변경사항 저장</BsButton>
      </div>
    </div>
  </div>
</template>
