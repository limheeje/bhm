<script setup lang="ts">
import './index.style.scss'
import {reactive} from 'vue'
import {BsCard, BsAvatar, BsInput, BsButton} from '~/components/common'
import StringUtil from '~/utils/StringUtil'

const toast = useToast()
const api = useAuthMe()
const localUserName = ref('')
const localUserEmail = ref('')
const localUserProfileImgFile = ref<File>()
const localUserProfileImgFileSrc = ref()

const user = reactive({
  staffContactNo: '', // 로그인 ID로도 쓰이는 연락처 (예: "010-1234-5678")
  staffNm: '', // 이름 (설정 페이지의 "이름" input과 매칭)
  email: '', // 이메일 (설정 페이지의 "이메일" input과 매칭)
  profileImgUrl: '', // 프로필 사진 URL. 아직 업로드 안 했으면 null → 이 경우 BsAvatar가 이니셜로 대체 표시
  userType: '', // 포털 구분값: 'ADMIN' | 'COMPANY' | 'DEALER' (constants/userType.ts 참고)
  orgNm: '', // 소속 기관/업체명 (예: "중앙도매시장")
  orgNo: '', // 소속 기관/업체 코드
  roleCd: '', // 권한 코드 (예: "MASTER_ADMIN") — 관리자 CRUD API에서 쓰던 것과 동일한 값
  lastLoginDt: '', // 마지막 로그인 일시 (ISO 문자열, 예: "2026-06-29T09:00:00")
  lastLoginIp: '' // 마지막 로그인 IP
})

const {data: me} = useAsyncData('pages-settings', async () => await api.getAuthMe())

watch(
  me,
  (res) => {
    if (res?.success) {
      Object.assign(user, {
        ...res.data,
        lastLoginDt: StringUtil.formatDate(res.data.lastLoginDt)
      })
      localUserName.value = user.staffNm
      localUserEmail.value = user.email
      localUserProfileImgFileSrc.value = user.profileImgUrl
    }
  },
  {immediate: true}
)

async function onSubmit() {
  const res = await api.putAuthMe({
    staffNm: user.staffNm,
    email: user.email
  })
  if (res?.success) {
    localUserName.value = res.data.staffNm
    localUserEmail.value = res.data.email
    toast.open({title: `완료 ${res?.message}`})
  } else {
    toast.open({title: `실패 ${res?.message}`})
  }
}
async function onChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input && input.files) {
    localUserProfileImgFile.value = input.files[0]
    const res = await api.postAuthMeAvatar({
      file: input.files[0]
    })
    if (res?.success) {
      localUserProfileImgFileSrc.value = res.data?.profileImgUrl
    } else {
      toast.open({title: `실패 ${res?.message}`})
    }
  }
}
</script>

<template>
  <div class="settings">
    <h2 class="settings__h2">설정</h2>
    <p class="settings__sub">워크스페이스 환경설정을 관리하세요</p>

    <div class="settings__stack">
      <ClientOnly>
        <BsCard title="프로필">
          <div class="settings__profile">
            <BsAvatar :name="localUserName" size="xl" status="online" :src="localUserProfileImgFileSrc" />
            <div class="settings__profile-meta">
              <div class="settings__profile-name">{{ localUserName }}</div>
              <div class="settings__profile-mail">{{ localUserEmail }} · {{ user.staffContactNo }}</div>
            </div>
            <!-- <BsButton variant="secondary" size="sm">사진 변경</BsButton> -->
          </div>
          <input type="file" accept="image/png,image/jpeg,image/webp" @change="onChange" />
          <div class="settings__grid" style="margin-top: 10px">
            <BsInput v-model="user.staffNm" label="이름" />
            <BsInput v-model="user.email" label="이메일" />
            <BsInput v-model="user.userType" label="유저타입" disabled />
            <BsInput v-model="user.orgNm" label="소속 기관/업체명" disabled />
            <BsInput v-model="user.orgNo" label="소속 기관/업체 코드" disabled />
            <BsInput v-model="user.roleCd" label="권한 코드" disabled />
            <BsInput v-model="user.lastLoginDt" label="마지막 로그인 일시" disabled />
            <BsInput v-model="user.lastLoginIp" label="마지막 로그인 IP" disabled />
          </div>
        </BsCard>
      </ClientOnly>

      <div class="settings__foot">
        <BsButton variant="secondary">취소</BsButton>
        <BsButton @click="onSubmit">변경사항 저장</BsButton>
      </div>
    </div>
  </div>
</template>
