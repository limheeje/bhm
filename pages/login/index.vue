<script setup lang="ts">
import type {LoginRequest, LoginResponse} from '~/types/auth'
import type {SingleResponse} from '~/types/commonResponse'
import './index.style.scss'
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {BsInput, BsButton} from '../../components/common'
import {useToast} from '~/composables/useToast'

definePageMeta({layout: false})

const router = useRouter()
const api = useLoginApi
const authStore = useAuthStore()
const localId = ref('010-1111-32')
const localPw = ref('1234')
const toast = useToast()

const mark =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32" fill="none">' +
      '<rect x="2" y="2" width="28" height="28" rx="8" fill="#2563d8"/><circle cx="16" cy="16" r="8" fill="#fff"/><circle cx="16" cy="16" r="3.5" fill="#2563d8"/></svg>'
  )

async function login() {
  try {
    const res: SingleResponse<LoginResponse> = await api.login({
      contactNo: localId.value,
      password: localPw.value
    } as LoginRequest)
    console.dir('res----', res)

    if (res.success) {
      console.log('res----', res)
      authStore.setLogin(res.data)
      router.push('/dashboard')
    }
  } catch (err: any) {
    console.dir('er----', err)
    toast.open({
      tone: (key) => key?.['DANGER'],
      title: 'asdfasdf'
    })
  }
}
</script>

<template>
  <div class="login">
    <div class="login__card">
      <img :src="mark" width="40" alt="Lumo" />
      <h1 class="login__title">다시 오신 걸 환영해요</h1>
      <p class="login__sub">Lumo 관리자 콘솔에 로그인하세요</p>

      <form class="login__form" @submit.prevent="login">
        <BsInput v-model="localId" label="전화번호" type="text" size="lg" placeholder="전화번호를 입력해주세요" />
        <div>
          <div class="login__row" style="margin-bottom: 6px">
            <label style="font: var(--type-label); color: var(--text-primary)">비밀번호</label>
          </div>
          <BsInput v-model="localPw" type="password" size="lg" />
        </div>
        <BsButton type="submit" size="lg" :full-width="true" style="margin-top: 4px">로그인</BsButton>
      </form>

      <div class="login__foot">계정이 없으신가요? <a>관리자에게 문의</a></div>
    </div>
  </div>
</template>
