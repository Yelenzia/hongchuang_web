<template>
  <div class="auth-page hc-container">
    <div class="hc-card auth-card">
      <div class="head"><div class="badge">欢迎回来</div><h1>登录鸿创工作室</h1><p>登录需要图形验证码与邮箱验证码，提升账号安全性。</p></div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
        <el-form-item label="用户名 / 邮箱" prop="account"><el-input v-model="form.account" placeholder="请输入用户名或邮箱" /></el-form-item>
        <el-form-item label="密码" prop="password"><el-input v-model="form.password" type="password" show-password placeholder="请输入密码" /></el-form-item>
        <el-form-item label="图形验证码" prop="captchaCode"><CaptchaBox v-model="form.captchaCode" :image-base64="captcha.imageBase64" @refresh="loadCaptcha" /></el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCode"><div class="code-row"><el-input v-model="form.emailCode" placeholder="请输入邮箱验证码" /><el-button plain :disabled="cooldown > 0" :loading="sending" @click="handleSendCode">{{ cooldown > 0 ? `${cooldown}s后重试` : '发送验证码' }}</el-button></div><div v-if="showDebugCode && debugCode" class="debug-tip">开发调试验证码：{{ debugCode }}</div></el-form-item>
        <div class="foot-links"><RouterLink to="/forgot-password">忘记密码？</RouterLink><RouterLink to="/register">没有账号？立即注册</RouterLink></div>
        <el-button class="submit-btn" type="primary" size="large" :loading="submitting" @click="handleLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import { useRouter, useRoute } from 'vue-router'
import CaptchaBox from '@/components/auth/CaptchaBox.vue'
import { getCaptchaApi, sendEmailCodeApi } from '@/api/auth'
const formRef = ref<FormInstance>(); const submitting = ref(false); const sending = ref(false); const debugCode = ref(''); const showDebugCode = import.meta.env.VITE_SHOW_DEBUG_CODE === 'true'; const cooldown = ref(0); let timer:number|undefined
const captcha = reactive({ captchaId: '', imageBase64: '' })
const form = reactive({ account: '', password: '', emailCode: '', captchaId: '', captchaCode: '' })
const rules: FormRules<typeof form> = { account: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }], password: [{ required: true, message: '请输入密码', trigger: 'blur' }], captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }], emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }] }
const authStore = useAuthStore(); const router = useRouter(); const route = useRoute()
const startCooldown = (seconds=60)=>{ cooldown.value=seconds; window.clearInterval(timer); timer=window.setInterval(()=>{ cooldown.value -=1; if(cooldown.value<=0) window.clearInterval(timer)},1000)}
const loadCaptcha = async()=>{ const { data }= await getCaptchaApi(); captcha.captchaId=data.captchaId; captcha.imageBase64=data.imageBase64; form.captchaId=data.captchaId; form.captchaCode='' }
const handleSendCode = async()=>{ if(!form.account.trim()) return ElMessage.warning('请先输入用户名或邮箱'); if(!form.captchaCode.trim() || !form.captchaId) return ElMessage.warning('请先输入图形验证码'); sending.value=true; try{ const { data } = await sendEmailCodeApi({ bizType:'LOGIN', account: form.account.trim(), captchaId: form.captchaId, captchaCode: form.captchaCode.trim()}); debugCode.value=data.debugCode||''; startCooldown(data.cooldownSeconds||60); ElMessage.success(data.message||'验证码已发送'); await loadCaptcha(); } finally { sending.value=false } }
const handleLogin = async()=>{ const valid=await formRef.value?.validate().catch(()=>false); if(!valid) return; submitting.value=true; try{ const loginData = await authStore.login({ ...form }); ElMessage.success(`登录成功，欢迎回来：${loginData.userInfo.nickname || loginData.userInfo.username}`); router.push((route.query.redirect as string) || '/'); } finally { submitting.value=false } }
onMounted(loadCaptcha); onBeforeUnmount(()=>window.clearInterval(timer))
</script>
<style scoped lang="scss">.auth-page { min-height: calc(100vh - 160px); padding-top: 120px; padding-bottom: 60px; display: grid; place-items: center; }.auth-card { width: min(560px, 100%); padding: 32px; }.badge { display: inline-flex; padding: 8px 14px; border-radius: 999px; background: rgba(18, 181, 203, 0.08); color: var(--hc-primary-deep); font-weight: 700; }.head h1 { margin: 16px 0 12px; }.head p { margin: 0 0 18px; color: var(--hc-text-secondary); }.code-row { display: grid; grid-template-columns: 1fr 132px; gap: 10px; width: 100%; }.debug-tip { margin-top: 8px; font-size: 12px; color: #f59e0b; }.foot-links { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 18px; }.submit-btn { width: 100%; }</style>